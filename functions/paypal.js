const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require('firebase-admin/firestore');

// PayPal APIのライブラリをインポート
const fetch = require('node-fetch');

// デバッグモード設定
const DEBUG_MODE = false;

// PayPalの認証情報
// 本番環境では環境変数またはCloud Secret Managerを使用
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';
const PAYPAL_CLIENT_SECRET = 'YOUR_PAYPAL_CLIENT_SECRET';
const PAYPAL_API_URL = 'https://api-m.paypal.com'; // 本番環境用URL

/**
 * PayPalのアクセストークンを取得する
 * @returns {Promise<string>} アクセストークン
 */
async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('PayPalトークン取得エラー:', data);
      throw new Error(`PayPalトークン取得エラー: ${data.error_description || 'Unknown error'}`);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('PayPalトークン取得中のエラー:', error);
    throw error;
  }
}

/**
 * PayPalでプラン情報を作成する
 */
exports.createPayPalPlan = onCall({
  region: "asia-northeast1",
}, async (request) => {
  try {
    const { name, description, amount, billingCycles, interval } = request.data;
    
    if (!name || !description || !amount || !interval) {
      throw new HttpsError(
        "invalid-argument",
        "必要なプラン情報が不足しています"
      );
    }
    
    // PayPalのアクセストークンを取得
    const accessToken = await getPayPalAccessToken();
    
    // プラン作成リクエスト
    const planData = {
      product_id: "YOUR_PRODUCT_ID", // PayPalコンソールで作成した商品ID
      name: name,
      description: description,
      billing_cycles: [
        {
          frequency: {
            interval_unit: interval.unit,
            interval_count: interval.count
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 無制限
          pricing_scheme: {
            fixed_price: {
              value: (amount / 100).toString(), // 金額を円からドルに変換（必要に応じて調整）
              currency_code: "JPY"
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "JPY"
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3
      }
    };
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(planData)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('PayPalプラン作成エラー:', responseData);
      throw new HttpsError(
        "internal",
        `PayPalプラン作成エラー: ${responseData.message || 'Unknown error'}`
      );
    }
    
    // Firestoreにプラン情報を保存
    const db = getFirestore();
    await db.collection('products').doc(responseData.id).set({
      name: name,
      description: description,
      active: true,
      paypal_plan_id: responseData.id,
      amount: amount,
      currency: 'JPY',
      interval: interval,
      created_at: new Date()
    });
    
    return {
      success: true,
      plan: responseData
    };
  } catch (error) {
    console.error('プラン作成エラー:', error);
    throw new HttpsError(
      "internal",
      `プラン作成エラー: ${error.message}`
    );
  }
});

/**
 * クーポン検証関数 - PayPal連携版
 */
exports.validateCouponPayPal = onCall({
  region: "asia-northeast1",
}, async (request) => {
  try {
    let { couponCode } = request.data;

    // 入力されたクーポンコードの空白を除去
    if (couponCode) {
      couponCode = couponCode.trim();
    }
    console.log("クーポン検証を開始しました:", couponCode);

    if (!couponCode) {
      throw new HttpsError(
        "invalid-argument",
        "クーポンコードが指定されていません"
      );
    }

    // クーポンテスト用の特別コード
    if (DEBUG_MODE || process.env.NODE_ENV !== 'production') {
      // テスト用クーポンコードの定義
      const testCoupons = {
        "NukebyeStart": {
          id: "test_coupon_id_1",
          name: "Nukebyeスタートクーポン",
          percent_off: 50, // 50%割引
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

    // Firestoreからクーポン情報を取得
    const db = getFirestore();
    const couponsRef = db.collection('coupons');
    const couponSnapshot = await couponsRef.where('code', '==', couponCode).where('active', '==', true).get();

    if (couponSnapshot.empty) {
      return {
        valid: false,
        message: "無効なクーポンコードです",
      };
    }

    // クーポン情報を取得
    const couponDoc = couponSnapshot.docs[0];
    const coupon = couponDoc.data();

    // 使用回数制限チェック
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return {
        valid: false,
        message: "このクーポンは使用上限に達しています",
      };
    }

    // 有効期限チェック
    if (coupon.expires_at && coupon.expires_at.toDate() < new Date()) {
      return {
        valid: false,
        message: "このクーポンは有効期限が切れています",
      };
    }

    // 有効なクーポン情報を返す
    return {
      valid: true,
      coupon: {
        id: couponDoc.id,
        code: coupon.code,
        name: coupon.name || "割引クーポン",
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency || "jpy",
      },
    };
  } catch (error) {
    console.error("クーポン検証エラー:", error);
    
    return {
      valid: false,
      message: error.message || "クーポン検証中にエラーが発生しました",
    };
  }
});

/**
 * サブスクリプション作成後のWebhook処理
 */
exports.handlePayPalWebhook = onCall({
  region: "asia-northeast1",
}, async (request) => {
  try {
    const { event_type, resource } = request.data;
    
    console.log('PayPal Webhook受信:', event_type);
    
    // サブスクリプションが作成された場合
    if (event_type === 'BILLING.SUBSCRIPTION.CREATED') {
      const subscriptionId = resource.id;
      const customerId = resource.custom_id; // Firebaseユーザーのカスタムフィールドとして設定
      
      if (!customerId) {
        console.error('カスタムIDが見つかりません');
        return { success: false, error: 'カスタムIDが見つかりません' };
      }
      
      // Firestoreのサブスクリプション情報を更新
      const db = getFirestore();
      const customerRef = db.collection('customers').doc(customerId);
      
      // サブスクリプションドキュメントを検索
      const subscriptionsSnapshot = await customerRef.collection('subscriptions')
        .where('paypal_subscription_id', '==', subscriptionId)
        .get();
      
      if (subscriptionsSnapshot.empty) {
        console.error('対応するサブスクリプションが見つかりません');
        return { success: false, error: '対応するサブスクリプションが見つかりません' };
      }
      
      // サブスクリプションステータスを更新
      const subscriptionDoc = subscriptionsSnapshot.docs[0];
      await subscriptionDoc.ref.update({
        status: 'active',
        updated_at: new Date()
      });
      
      return { success: true };
    }
    
    // サブスクリプションがキャンセルされた場合
    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      // キャンセル処理を実装
    }
    
    return { success: true };
  } catch (error) {
    console.error('PayPal Webhook処理エラー:', error);
    return { success: false, error: error.message };
  }
});
