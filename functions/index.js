const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require('firebase-admin');
const {FieldValue} = require('firebase-admin/firestore');

// Firebase Admin初期化（まだ初期化されていない場合）
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * 報告(posts)作成時にポイントを付与するトリガー (Work 2-3 / B-2)
 * ポイント付与・reportCount/totalPosts の加算はクライアントではなくサーバーで行い、
 * 改ざんを防止する。付与したポイント数は post ドキュメントに pointsEarned として
 * 書き戻し、クライアントが表示に使えるようにする。
 */
exports.awardPointsOnPost = onDocumentCreated({
  document: "posts/{postId}",
  region: "asia-northeast1",
}, async (event) => {
  const snap = event.data;
  if (!snap) return;

  const post = snap.data() || {};
  const authorId = post.authorId;
  if (!authorId) return;

  // 15〜25ポイントをサーバー側で決定(クライアントの乱数を信用しない)
  const pointsEarned = Math.floor(Math.random() * 11) + 15;

  const db = admin.firestore();
  const userRef = db.collection("users").doc(authorId);

  try {
    await userRef.set({
      points: FieldValue.increment(pointsEarned),
      reportCount: FieldValue.increment(1),
      totalPosts: FieldValue.increment(1),
    }, {merge: true});

    // 付与ポイントを post に記録(クライアント表示用)
    await snap.ref.set({pointsEarned}, {merge: true});
  } catch (error) {
    console.error("ポイント付与に失敗しました:", authorId, error);
  }
});

// デバッグモード設定
const DEBUG_MODE = false;

// PayPalの認証情報
// 本番環境では環境変数またはCloud Secret Managerを使用
// 重要: 本番環境にデプロイする前に、以下のコマンドで本番用のPayPalクライアントIDとシークレットを設定してください:
// firebase functions:config:set paypal.client_id=YOUR_PAYPAL_CLIENT_ID
// firebase functions:config:set paypal.client_secret=YOUR_PAYPAL_CLIENT_SECRET

// PayPalモジュールをインポート
const paypalFunctions = require('./paypal');

// PayPal関数をエクスポート
exports.createPayPalPlan = paypalFunctions.createPayPalPlan;
exports.validateCouponPayPal = paypalFunctions.validateCouponPayPal;
exports.handlePayPalWebhook = paypalFunctions.handlePayPalWebhook;

/**
 * クーポン検証関数 - 旧Stripe連携版 (v2) - 互換性のために残す
 */
exports.validateCouponV3 = onCall({
  region: "asia-northeast1",
}, async (request) => {
  try {
    // Stripe初期化
    const stripe = require("stripe")(STRIPE_KEY);

    let {couponCode, priceId} = request.data;

    // 入力されたクーポンコードの空白を除去
    if (couponCode) {
      couponCode = couponCode.trim();
    }
    console.log("クーポン検証を開始しました:", couponCode);
    console.log("プランID:", priceId);

    if (!couponCode) {
      throw new HttpsError(
          "invalid-argument",
          "クーポンコードが指定されていません",
      );
    }

    // クーポンテスト用の特別コード
    if (DEBUG_MODE) {
      // テスト用クーポンコードの定義
      const testCoupons = {
        "NukebyeStart": {
          id: "test_coupon_id_1",
          name: "Nukebyeスタートクーポン",
          amount_off: 500, // 500円割引
          currency: "jpy",
        },
        "test1": {
          id: "test_coupon_id_2",
          name: "30%割引クーポン",
          percent_off: 30, // 30%割引
          currency: "jpy",
        },
        "WELCOME10": {
          id: "test_coupon_id_3",
          name: "新規登録クーポン",
          percent_off: 10, // 10%割引
          currency: "jpy",
        },
        "SUMMER2025": {
          id: "test_coupon_id_4",
          name: "夏季キャンペーン",
          amount_off: 1000, // 1000円割引
          currency: "jpy",
        },
      };

      // 入力されたクーポンコードがテストクーポンとして定義されているかチェック
      if (testCoupons[couponCode]) {
        console.log(`${couponCode} テスト用クーポンを適用します`);
        return {
          valid: true,
          coupon: testCoupons[couponCode],
          message: "テストクーポンが適用されました",
        };
      }
    }

    // Stripeでクーポンコードを検索
    console.log("Stripe APIでプロモーションコードを検索します");
    const promoCodesResponse = await stripe.promotionCodes.list({
      code: couponCode,
      active: true,
      limit: 1,
    });

    if (promoCodesResponse.data && promoCodesResponse.data.length > 0) {
      const promoCode = promoCodesResponse.data[0];
      // couponIdが文字列であることを確認
      const couponId = typeof promoCode.coupon === "string" ?
        promoCode.coupon :
        (promoCode.coupon && promoCode.coupon.id);

      console.log("プロモーションコード情報:", JSON.stringify(promoCode, null, 2));
      console.log("取得したクーポンID:", couponId);

      try {
        // クーポン情報を取得
        const coupon = await stripe.coupons.retrieve(couponId);
        console.log("取得したクーポン情報:", JSON.stringify(coupon, null, 2));

        // 使用回数制限チェック
        if (promoCode.max_redemptions &&
            promoCode.times_redeemed >= promoCode.max_redemptions) {
          return {
            valid: false,
            message: "このクーポンは使用上限に達しています",
          };
        }

        // 有効期限チェック
        const now = Math.floor(Date.now() / 1000);
        if (promoCode.expires_at && promoCode.expires_at < now) {
          return {
            valid: false,
            message: "このクーポンは有効期限が切れています",
          };
        }

        // 有効なクーポン情報を返す
        return {
          valid: true,
          coupon: {
            id: coupon.id,
            code: promoCode.code,
            name: coupon.name || "割引クーポン",
            percent_off: coupon.percent_off,
            amount_off: coupon.amount_off,
            duration: coupon.duration,
            duration_in_months: coupon.duration_in_months,
            currency: coupon.currency,
          },
        };
      } catch (couponError) {
        console.error("クーポン取得エラー:", couponError);
        return {
          valid: false,
          message: `Stripeクーポン取得エラー: ${couponError.message}`,
        };
      }
    } else {
      // クーポンが見つからない場合
      return {
        valid: false,
        message: "無効なクーポンコードです",
      };
    }
  } catch (error) {
    console.error("クーポン検証エラー:", error);

    // デバッグモードではエラー情報をログ出力
    if (DEBUG_MODE) {
      console.log("エラーの詳細:", JSON.stringify(error, null, 2));
    }

    // Stripe APIエラーかどうかを確認
    if (error.type && error.type.startsWith("Stripe")) {
      return {
        valid: false,
        message: `Stripeエラー: ${error.message}`,
      };
    }

    return {
      valid: false,
      message: error.message || "クーポン検証中にエラーが発生しました",
    };
  }
});
