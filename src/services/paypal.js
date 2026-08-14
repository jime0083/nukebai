/**
 * PayPal Commerce Platform サービス
 * PayPal決済機能を管理するためのサービス
 */
import { loadScript } from '@paypal/paypal-js';
import { db, auth } from '../firebase';
import { doc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// PayPalのクライアントID (本番環境用)
// 注意: 実際のクライアントIDに置き換える必要があります
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';

// PayPalのSDKをロードする
export async function loadPayPalSDK() {
  try {
    return await loadScript({
      'client-id': PAYPAL_CLIENT_ID,
      currency: 'JPY',
      intent: 'subscription'
    });
  } catch (error) {
    console.error('PayPal SDKの読み込みエラー:', error);
    throw error;
  }
}

/**
 * サブスクリプションを開始する
 * @param {Object} selectedPlan - 選択されたプラン情報
 * @param {Object} coupon - 適用されたクーポン情報 (オプション)
 * @returns {Promise} - 処理結果のPromise
 */
export async function startSubscription(selectedPlan, coupon = null) {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('ユーザーがログインしていません');
  }

  // カスタマー情報をFirestoreに作成/更新
  const customerDocRef = doc(db, 'customers', currentUser.uid);
  await setDoc(customerDocRef, {
    email: currentUser.email,
    created: serverTimestamp()
  }, { merge: true });

  // サブスクリプション情報を作成
  const subscriptionsRef = collection(customerDocRef, 'subscriptions');
  const subscriptionData = {
    plan_id: selectedPlan.id,
    status: 'pending',
    price: selectedPlan.amount,
    currency: 'JPY',
    created_at: serverTimestamp(),
    payment_provider: 'paypal',
    metadata: {
      created_by: currentUser.uid
    }
  };

  // クーポンが適用されている場合は追加
  if (coupon) {
    subscriptionData.coupon = coupon;
    if (coupon.percent_off) {
      subscriptionData.discount_percent = coupon.percent_off;
    } else if (coupon.amount_off) {
      subscriptionData.discount_amount = coupon.amount_off;
    }
  }

  // サブスクリプションドキュメントを作成
  const subscriptionDoc = await addDoc(subscriptionsRef, subscriptionData);
  
  return {
    subscriptionId: subscriptionDoc.id,
    subscriptionData
  };
}

/**
 * PayPalサブスクリプション処理が完了した後の処理
 * @param {string} subscriptionId - FirestoreのサブスクリプションID
 * @param {Object} paypalSubscription - PayPalから返されたサブスクリプション情報
 */
export async function completeSubscription(userId, subscriptionId, paypalSubscription) {
  try {
    const customerDocRef = doc(db, 'customers', userId);
    const subscriptionDocRef = doc(collection(customerDocRef, 'subscriptions'), subscriptionId);
    
    // サブスクリプション情報を更新
    await setDoc(subscriptionDocRef, {
      status: 'active',
      paypal_subscription_id: paypalSubscription.id,
      paypal_data: paypalSubscription,
      updated_at: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('サブスクリプション完了処理エラー:', error);
    throw error;
  }
}

/**
 * クーポンコードを検証する
 * @param {string} couponCode - 検証するクーポンコード
 * @returns {Promise<Object>} - クーポン検証結果
 */
export async function validateCoupon(couponCode) {
  try {
    // Firebase Cloud Functionsを使用してクーポンを検証
    const functions = getFunctions();
    const validateCouponFunction = httpsCallable(functions, 'validateCouponPayPal');
    
    const result = await validateCouponFunction({ couponCode });
    return result.data;
  } catch (error) {
    console.error('クーポン検証エラー:', error);
    throw error;
  }
}
