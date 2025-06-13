<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { db, auth } from '../firebase'
import { 
  collection, getDocs, query, where, doc, 
  getDoc, onSnapshot, addDoc, setDoc, serverTimestamp
} from 'firebase/firestore'
import { loadStripe } from '@stripe/stripe-js'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)
const prices = ref([])
const currentSubscription = ref(null)
const message = ref('')
const errorMessage = ref('')
const selectedPrice = ref(null)
const cardComplete = ref(false)
const processingPayment = ref(false)
const stripe = ref(null);
const elements = ref(null);
const cardNumber = ref(null);
const cardExpiry = ref(null);
const cardCvc = ref(null);
const cardError = ref('');

// Stripeキー（公開可能キー）
const stripePromise = loadStripe('pk_test_51RT4oICZs8zzhYHBUvmMx6293sNWr8oSvHFfHQZ3P3yxd6rqD2MNo4TJTsVz0V6fJy79pcX4pLOJFKiwSyKooZAK00iVDQMwkG')

// 認証状態の確認
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUser = computed(() => auth.currentUser)

// Firestoreから価格プランを取得
async function fetchPrices() {
  try {
    console.log('価格プランを取得中...');
    const pricesCollection = collection(db, 'products');
    const pricesSnapshot = await getDocs(pricesCollection);
    
    console.log(`取得したproducts: ${pricesSnapshot.docs.length}件`);
    
    let fetchedPrices = [];
    let foundPrices = false;
    
    // Firestoreからのデータ取得を試みる
    for (const productDoc of pricesSnapshot.docs) {
      const productData = productDoc.data();
      console.log('商品データ:', productData);
      
      // アクティブな商品のみ表示
      if (productData.active) {
        const priceQuery = query(
          collection(db, 'products', productDoc.id, 'prices'),
          where('active', '==', true)
        );
        
        const priceSnapshot = await getDocs(priceQuery);
        console.log(`商品 ${productDoc.id} の価格データ: ${priceSnapshot.docs.length}件`);
        
        priceSnapshot.docs.forEach((priceDoc) => {
          const priceData = priceDoc.data();
          console.log('価格データ:', priceData);
          foundPrices = true;
          
          fetchedPrices.push({
            id: priceDoc.id,
            productId: productDoc.id,
            name: productData.name,
            description: productData.description,
            amount: priceData.unit_amount / 100, // 金額を円で表示
            currency: priceData.currency,
            interval: priceData.interval || '月',
            intervalCount: priceData.interval_count || 1
          });
        });
      }
    }
    
    // Firestoreから価格データが取得できなかった場合はテストデータを使用
    if (!foundPrices || fetchedPrices.length === 0) {
      console.log('商品データが取得できなかったため、テスト用データを使用します');
      fetchedPrices = [];
      
      fetchedPrices.push({
        id: 'price_test1',
        productId: 'prod_test1',
        name: 'プレミアムプラン（月額）',
        description: '全ての機能が使い放題のプレミアムプラン',
        amount: 980,
        currency: 'jpy',
        interval: '月',
        intervalCount: 1
      });
      
      fetchedPrices.push({
        id: 'price_test2',
        productId: 'prod_test2',
        name: 'プレミアムプラン（年間）',
        description: '年間契約でお得なプレミアムプラン',
        amount: 9800,
        currency: 'jpy',
        interval: '年',
        intervalCount: 1
      });
    }
    
    console.log('最終的な価格データ:', fetchedPrices);
    prices.value = fetchedPrices;
    loading.value = false;
  } catch (error) {
    console.error('価格データの取得に失敗しました:', error);
    errorMessage.value = '価格データの読み込みに失敗しました。もう一度お試しください。';
    loading.value = false;
  }
}

// 現在のサブスクリプション状態を取得
async function checkSubscription() {
  if (!currentUser.value) return;
  
  try {
    const customerDocRef = doc(db, 'customers', currentUser.value.uid);
    const subscriptionsCollectionRef = collection(customerDocRef, 'subscriptions');
    
    // サブスクリプションの変更をリアルタイムで監視
    onSnapshot(subscriptionsCollectionRef, (snapshot) => {
      const subscriptions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          status: data.status,
          priceId: data.price ? data.price.id : null,
          cancelAtPeriodEnd: data.cancel_at_period_end,
          currentPeriodEnd: data.current_period_end ? data.current_period_end.toDate() : null,
          created: data.created ? data.created.toDate() : null
        };
      });
      
      // アクティブなサブスクリプションがあるかチェック
      const activeSubscription = subscriptions.find(sub => 
        ['active', 'trialing'].includes(sub.status)
      );
      
      if (activeSubscription) {
        currentSubscription.value = activeSubscription;
        // ユーザーストアのサブスクリプションステータスを更新
        userStore.updateSubscription('paid');
      } else {
        currentSubscription.value = null;
        userStore.updateSubscription('free');
      }
    });
  } catch (error) {
    console.error('サブスクリプション状態の取得に失敗しました:', error);
  }
}

// Stripe要素の初期化
async function initializeStripeElements() {
  try {
    console.log('Stripe要素を初期化中...');
    const stripeInstance = await stripePromise;
    if (!stripeInstance) {
      console.error('Stripeインスタンスの初期化に失敗しました');
      return;
    }
    
    console.log('Stripeインスタンス:', stripeInstance);
    stripe.value = stripeInstance;
    elements.value = stripeInstance.elements();
    
    console.log('カード要素を作成中...');
    // カード要素のマウント（遅延させることで確実にDOM要素が存在することを確認）
    // より長い遅延を設定
    setTimeout(() => {
      try {
        console.log('カード要素のマウントを試みます...');
        // 共通のスタイル設定
        const elementStyle = {
          base: {
            color: '#ffffff',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#cccccc'
            },
            backgroundColor: 'transparent'
          },
          invalid: {
            color: '#ff5555',
            iconColor: '#ff5555'
          }
        };
        
        console.log('個別のカード要素を作成中...');
        
        // カード番号要素
        cardNumber.value = elements.value.create('cardNumber', {
          style: elementStyle
        });
        
        // 有効期限要素
        cardExpiry.value = elements.value.create('cardExpiry', {
          style: elementStyle
        });
        
        // CVCコード要素
        cardCvc.value = elements.value.create('cardCvc', {
          style: elementStyle
        });
        
        console.log('カード要素をDOMにマウント中...');
        
        // 各要素を対応するDOM要素にマウント
        const cardNumberMount = document.getElementById('card-number-element');
        const cardExpiryMount = document.getElementById('card-expiry-element');
        const cardCvcMount = document.getElementById('card-cvc-element');
        
        if (cardNumberMount && cardExpiryMount && cardCvcMount) {
          cardNumber.value.mount('#card-number-element');
          cardExpiry.value.mount('#card-expiry-element');
          cardCvc.value.mount('#card-cvc-element');
          
          // 各要素にイベントリスナーを追加
          cardNumber.value.on('change', handleCardChange);
          cardExpiry.value.on('change', handleCardChange);
          cardCvc.value.on('change', handleCardChange);
          
          console.log('すべてのカード要素のマウントが完了しました');
        } else {
          console.error('カード要素のマウントに必要なDOM要素が見つかりませんでした');
        }
      } catch (error) {
        console.error('カード要素の作成・マウント中にエラーが発生しました:', error);
      }
    }, 1000); // より長い遅延を設定
  } catch (error) {
    console.error('Stripe要素の初期化中にエラーが発生しました:', error);
  }
}

function handleCardChange(event) {
  console.log('カード入力の変更イベント:', event);
  
  // 各フィールドの完了状態をチェック
  if (event.elementType === 'cardNumber' && event.complete) {
    // カード番号が正しい場合、次のフィールドにフォーカスを移動
    cardExpiry.value.focus();
  } else if (event.elementType === 'cardExpiry' && event.complete) {
    // 有効期限が正しい場合、CVCフィールドにフォーカスを移動
    cardCvc.value.focus();
  }
  
  // すべての入力フィールドが完了しているか確認する機能を将来追加予定
  
  if (event.error) {
    cardError.value = event.error.message;
  } else {
    cardError.value = '';
  }
  
  // カード入力の完了状態を更新
  if (cardNumber.value && cardExpiry.value && cardCvc.value) {
    // すべての要素が正しく初期化されていれば、完了状態を更新
    cardComplete.value = event.complete;
    console.log('cardComplete値を更新:', cardComplete.value);
  }
}

// プランを選択する
function selectPlan(price) {
  selectedPrice.value = price;
  // プランが選択されたらStripeエレメントを初期化
  // この後にDOMが更新されるまで少し待つ
  setTimeout(() => {
    console.log('プラン選択後、Stripe要素を初期化します');
    initializeStripeElements();
  }, 100);
}

// カード情報の入力をクリアする
function resetCardSelection() {
  selectedPrice.value = null;
  cardComplete.value = false;
  cardError.value = '';
}

// サブスクリプションを開始する処理
async function startSubscription() {
  console.log('startSubscription関数が呼び出されました');
  
  // すでに処理中なら重複実行を防止
  if (processingPayment.value) {
    console.log('既に処理中のため、重複実行を防止します');
    return;
  }
  
  // カード入力が完了しているか確認
  console.log('カード完了状態:', cardComplete.value);
  if (!cardComplete.value) {
    console.log('カード情報が完了していません');
    cardError.value = 'カード情報を正しく入力してください。';
    return;
  }

  if (!currentUser.value) {
    console.log('ユーザーがログインしていません');
    router.push('/login');
    return;
  }
  
  if (!selectedPrice.value) {
    console.log('価格が選択されていません', selectedPrice.value);
    cardError.value = 'プランを選択してください。';
    return;
  }
  
  if (!stripe.value || !elements.value) {
    console.log('Stripeインスタンスがありません');
    cardError.value = 'Stripe初期化エラー。ページを再読み込みしてください。';
    return;
  }

  try {
    console.log('サブスクリプション処理を開始します');
    processingPayment.value = true;
    cardError.value = '';
    
    // 60秒後に強制的にタイムアウト処理を行う
    const timeoutId = setTimeout(() => {
      if (processingPayment.value) {
        console.log('サブスクリプション処理が60秒経過。強制的にリダイレクトします');
        processingPayment.value = false;
        window.location.replace(window.location.origin + '/success');
      }
    }, 60000);
    
    // カード要素の確認
    if (!cardNumber.value || !cardExpiry.value || !cardCvc.value) {
      console.error('カード要素が見つかりません');
      cardError.value = 'カード入力フォームのエラー。ページを再読み込みしてください。';
      processingPayment.value = false;
      return;
    }
    
    // カスタマーをFirestoreに作成（まだ存在しない場合）
    console.log('Firestoreにカスタマー情報を作成/更新します', currentUser.value.uid);
    const customerDocRef = doc(db, 'customers', currentUser.value.uid);
    await setDoc(customerDocRef, {
      email: currentUser.value.email,
      created: serverTimestamp()
    }, { merge: true });
    console.log('カスタマー情報を作成/更新しました');

    // Stripe Payment Method(カード情報)を作成
    console.log('カード情報から支払い方法(PaymentMethod)を作成します');
    const { error: stripeError, paymentMethod } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: cardNumber.value,  // カード番号要素を指定すれば、他の要素も同じセッションとして利用される
      billing_details: {
        email: currentUser.value.email
      }
    });

    if (stripeError) {
      console.error('Stripe支払い方法の作成エラー:', stripeError);
      cardError.value = stripeError.message || "支払い方法の登録に失敗しました";
      processingPayment.value = false;
      return;
    }

    console.log('支払い方法の作成に成功:', paymentMethod);

    // ユーザーの支払い方法をFirestoreに保存
    console.log('支払い方法をFirestoreに保存します');
    const paymentMethodsRef = collection(customerDocRef, "payment_methods");
    await addDoc(paymentMethodsRef, {
      id: paymentMethod.id,
      type: paymentMethod.type,
      card: paymentMethod.card,
      created: serverTimestamp()
    });
    console.log('支払い方法をFirestoreに保存しました');

    // 直接サブスクリプションを作成
    console.log('サブスクリプションを直接作成します', selectedPrice.value.id);
    const subscriptionsRef = collection(customerDocRef, 'subscriptions');
    const subscriptionData = {
      price: selectedPrice.value.id,
      payment_method: paymentMethod.id,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        created_at: new Date().toISOString(),
        created_by: currentUser.value.uid
      }
    };
    
    console.log('サブスクリプションデータ:', subscriptionData);
    const subscriptionDoc = await addDoc(subscriptionsRef, subscriptionData);
    console.log('サブスクリプションドキュメント作成:', subscriptionDoc.id);

    // サブスクリプションの状態をリアルタイムで監視
    const unsubscribe = onSnapshot(doc(subscriptionsRef, subscriptionDoc.id), async (snap) => {
      const data = snap.data();
      console.log('サブスクリプション状態の更新:', data);

      if (data?.error) {
        console.error('サブスクリプションエラー:', data.error);
        cardError.value = data.error.message || 'サブスクリプションの処理中にエラーが発生しました';
        processingPayment.value = false;
        unsubscribe();
        return;
      }

      // サブスクリプションがアクティブになった場合またはサブスクリプションが作成された場合
      if (data?.status === 'active' || data?.status === 'trialing' || data?.price) {
        console.log('サブスクリプション処理が完了しました。成功ページにリダイレクトします');
        
        // Windowオブジェクトを使用して直接リダイレクト（Vue Routerをバイパス）
        window.location.replace(window.location.origin + '/success');
        unsubscribe();
        return;
      }
      
      // 後処理ページが必要な場合
      if (data?.latest_invoice?.payment_intent?.client_secret) {
        console.log('支払い確認が必要です。Stripeの確認ページに進みます。');
        
        // Stripe要素を使用してカード認証を完了させる
        const { error: confirmError } = await stripe.value.confirmCardPayment(
          data.latest_invoice.payment_intent.client_secret
        );
        
        if (confirmError) {
          console.error('支払い確認エラー:', confirmError);
          cardError.value = confirmError.message || '支払い処理に失敗しました';
          processingPayment.value = false;
        } else {
          console.log('支払い確認が完了しました。5秒後に成功ページへリダイレクトします。');
          // 支払い確認完了後、即座にリダイレクト
          setTimeout(() => {
            console.log('手動でリダイレクトを実行します');
            window.location.replace(window.location.origin + '/success');
          }, 5000);
        }
      } else {
        // サブスクリプション作成後は即座に成功ページへ移動
        console.log('サブスクリプション作成完了。5秒後に成功ページへリダイレクトします');
        setTimeout(() => {
          console.log('手動でリダイレクトを実行します');
          processingPayment.value = false;
          window.location.replace(window.location.origin + '/success');
        }, 5000);
      }
    });

  } catch (e) {
    console.error('サブスクリプション処理中のエラー:', e);
    cardError.value = `エラーが発生しました: ${e.message || '不明なエラー'}`;
    processingPayment.value = false;
  }
}



// マウント時の処理
onMounted(() => {
  if (!isLoggedIn.value) {
    message.value = 'サブスクリプションを開始するには、ログインしてください。';
    loading.value = false;
    return;
  }
  
  console.log('プランを取得します');
  fetchPrices();
  checkSubscription();
  
  // ページ読み込み時に自動的にStripe要素を初期化する
  setTimeout(() => {
    initializeStripeElements();
    // 初めてのロード時にplansの最初のアイテムを自動選択
    if (prices.value.length > 0) {
      selectedPrice.value = prices.value[0];
    }
  }, 1000);
});
</script>

<template>
  <div class="subscription-page">
    <div class="container">
      <h2 class="white-text">NukeBye プレミアム会員登録</h2>
      
      <div v-if="loading" class="loading">
        <p>読み込み中...</p>
      </div>
      
      <div v-else-if="!isLoggedIn" class="login-required">
        <p>{{ message }}</p>
        <router-link to="/login" class="btn btn-primary">ログインする</router-link>
      </div>
      
      <div v-else-if="errorMessage" class="error-container">
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="fetchPrices" class="btn btn-secondary">もう一度試す</button>
      </div>
      
      <div v-else-if="currentSubscription" class="subscription-active">
        <div class="success-icon">✓</div>
        <h3>プレミアムプラン加入済み</h3>
        <p>現在プレミアム会員です</p>
        <p class="subscription-details">
          <strong>ステータス:</strong> {{ currentSubscription.status === 'active' ? 'アクティブ' : '試用期間' }}<br>
          <strong>次回更新日:</strong> {{ new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('ja-JP') }}
        </p>
        <router-link to="/" class="btn btn-success">トップページに戻る</router-link>
      </div>
      
      <div v-else class="pricing-plans">
        <p class="intro-text white-text">プレミアム会員になって、ヌけないアダルト動画で浪費する時間とお金をなくしましょう！</p>
        
        <div v-if="prices.length === 0" class="no-plans">
          <p>現在ご利用可能なプランはありません。</p>
        </div>

        <div v-if="selectedPrice" class="payment-form">
          <div class="selected-plan">
            <p class="price-amount">¥{{ selectedPrice.amount.toLocaleString() }} / {{ selectedPrice.interval }}</p>
          </div>
          
          <div class="card-container">
            <h4>カード情報を入力してください</h4>
            <div class="card-container-wrapper">
              <div class="card-fields-container">
                <div class="card-field">
                  <label for="card-number-element">カード番号</label>
                  <div id="card-number-element" class="card-field-input"></div>
                </div>
                
                <div class="card-row">
                  <div class="card-field card-field-half">
                    <label for="card-expiry-element">有効期限</label>
                    <div id="card-expiry-element" class="card-field-input"></div>
                  </div>
                  
                  <div class="card-field card-field-half">
                    <label for="card-cvc-element">CVC</label>
                    <div id="card-cvc-element" class="card-field-input"></div>
                  </div>
                </div>
              </div>
              
              <div v-if="cardError" class="card-error">{{ cardError }}</div>
            </div>
            
            <button 
              @click="startSubscription" 
              class="btn btn-primary subscribe-btn"
              :disabled="processingPayment"
            >
              {{ processingPayment ? '処理中...' : 'サブスクリプションを利用する' }}
            </button>
          </div>
        </div>

        <div v-else class="plans-container">
          <div v-for="price in prices" :key="price.id" class="price-card">
            <div class="price-header">
              <h3>{{ price.name }}</h3>
              <p class="price-amount">¥{{ price.amount.toLocaleString() }} / {{ price.interval }}</p>
            </div>
            <div class="price-body">
              <p class="price-description">{{ price.description }}</p>
            </div>
            <div class="price-footer">
              <button 
                @click="selectPlan(price)" 
                class="btn btn-primary subscribe-btn"
              >
                選択する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-page {
  padding: 2rem;
  min-height: 80vh;
  background-color: #111111;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  text-align: center;
}

.white-text {
  color: white;
}

.loading, .login-required, .error-container, .no-plans {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.intro-text {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  /* color: #4b5563; */
}

.plans-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.price-card {
  background-color: black;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: white;
}

.price-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.price-header {
  background-color: #000000;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.price-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.price-amount {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.5rem 0 0;
}

.price-body {
  padding: 1.5rem;
  text-align: center;
  min-height: 0;
  display: none;
}

.price-description {
  color: #4b5563;
}

.price-footer {
  padding: 1rem 1.5rem 1.5rem;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #ff0000;
  color: white;
}

.btn-primary:hover {
  background-color: #cc0000;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.subscribe-btn {
  width: 100%;
  font-size: 1rem;
}

.subscription-active {
  background-color: #f0fdf4;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #86efac;
  margin-top: 2rem;
}

.success-icon {
  background-color: #10b981;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
}

.subscription-details {
  background-color: white;
  border-radius: 6px;
  padding: 1rem;
  margin: 1.5rem auto;
  max-width: 400px;
  text-align: left;
}

/* カード入力フォームのスタイル */
.payment-form {
  max-width: 600px;
  margin: 0 auto;
}

.selected-plan {
  background-color: #000000;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #333333;
  color: white;
}

.back-btn {
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.card-container {
  background-color: #000000;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  padding: 2rem;
  color: white;
}

.card-fields-container {
  margin: 1.5rem 0;
}

.card-field {
  margin-bottom: 1rem;
}

.card-row {
  display: flex;
  gap: 1rem;
}

.card-field-half {
  flex: 1;
}

.card-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #eeeeee;
}

.card-field-input {
  border: 1px solid #333333;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: #222222;
  min-height: 40px;
}

/* カード要素の子要素にも高さを設定 */
.card-field-input iframe {
  height: 24px;
  min-height: 24px;
  background-color: transparent !important;
}

.card-error {
  color: #dc2626;
  font-size: 0.9rem;
  margin: 0.5rem 0 1.5rem;
}
</style>