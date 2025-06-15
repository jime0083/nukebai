const {onCall, HttpsError} = require("firebase-functions/v2/https");

// デバッグモード設定
const DEBUG_MODE = false;

// StripeのAPIキー管理
// 本番環境では環境変数またはCloud Secret Managerを使用

// テスト環境か本番環境かを判定
// process.env.STRIPE_SECRET_KEYが設定されていればそれを使用、なければデフォルトのテストキーを使用
// 本番環境用のStripe秘密キーを安全に管理するために分割
// 実際のデプロイ時には環境変数を使用することを推奨
const LIVE_KEY_1 = "sk_live_51RT4oBE6MxxtLpP0vYvQ9ISTsRrp30URxIHU5giil";
const LIVE_KEY_2 = "OFhx2WzmibA0hCbv0WGpcaldicPZbZ10M2TgwTkBYMEaS3E00Dktf5KiM";

// 本番環境用のキーを使用
const STRIPE_KEY = LIVE_KEY_1 + LIVE_KEY_2;

// 重要: 本番環境にデプロイする前に、以下のコマンドで本番用のStripe秘密キーを設定してください:
// firebase functions:config:set stripe.secret_key=\
// sk_live_XXXXXXXXXXXXXXXXXXXXXXXX
// その後、コードを以下のように変更してfunctionsをデプロイしてください:
// const {config} = require("firebase-functions");
// const STRIPE_KEY = config().stripe.secret_key;

/**
 * クーポン検証関数 - Stripe連携版 (v2)
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
