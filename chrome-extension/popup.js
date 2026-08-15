// ヌケバイ Chrome拡張 - 報告機能(MV3準拠: ローカル同梱の Firebase compat SDK を使用)
// firebase-config.js が global の firebaseConfig を定義している前提。

// Firebase 初期化
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Google ログイン用 OAuth クライアントID(Webアプリ型。GCP でリダイレクトURI
// https://<拡張ID>.chromiumapp.org/ を許可しておくこと。manual-work M-4)
const GOOGLE_CLIENT_ID = '1019921068987-ok1odk5kk0a6vgacjofn9rj1p4mdevii.apps.googleusercontent.com';

// 動画IDの正規化
// ※ Web(src/utils/videoId.js)の normalizeVideoId と同一ロジック(拡張は別コンテキスト
//   のため import できず同一アルゴリズムをインライン化)。両者を変更する際は必ず揃えること。
//   ルール: 全角→半角 / 大文字化 / trim / 区切り統一 / 「英字+数字」で区切り無しは分割。
function normalizeVideoId(input) {
  if (input === null || input === undefined) return '';
  let s = String(input);
  // 全角英数記号(！-～)→ 半角
  s = s.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  // 全角スペース → 半角スペース
  s = s.replace(/　/g, ' ');
  s = s.trim().toUpperCase();
  if (s === '') return '';
  // 区切り(空白/アンダースコア/ドット)→ ハイフン、連続ハイフンを1つに、両端ハイフン除去
  s = s.replace(/[\s_.]+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  // 「英字のみ + 数字のみ」で区切りが無い場合はハイフンを挿入
  const m = s.match(/^([A-Z]+)(\d+)$/);
  if (m) {
    s = `${m[1]}-${m[2]}`;
  }
  return s;
}

// URL から動画IDを推測(ベストエフォート)
function extractVideoId(url) {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return pathSegments[pathSegments.length - 1];
    }
  } catch (e) {
    // URL でない場合は無視
  }
  return '';
}

document.addEventListener('DOMContentLoaded', async function () {
  const loadingView = document.getElementById('loadingView');
  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('loginButton');
  const googleLoginButton = document.getElementById('googleLoginButton');
  const loginError = document.getElementById('loginError');

  const currentUserEmail = document.getElementById('currentUserEmail');
  const logoutButton = document.getElementById('logoutButton');
  const redirectHint = document.getElementById('redirectHint');

  // Google ログインのリダイレクトURI(GCP に登録が必要)を画面に明示
  const REDIRECT_URI = chrome.identity.getRedirectURL();
  if (redirectHint) {
    redirectHint.textContent = 'Googleログイン用リダイレクトURI: ' + REDIRECT_URI;
  }

  const videoIdInput = document.getElementById('videoId');
  const videoTitleInput = document.getElementById('videoTitle');
  const reasonCheckboxes = document.querySelectorAll('input[name="reason"]');
  const reportButton = document.getElementById('reportButton');
  const reportError = document.getElementById('reportError');
  const reportForm = document.getElementById('reportForm');
  const successMessage = document.getElementById('successMessage');
  const reportAgainButton = document.getElementById('reportAgainButton');

  function showError(el, message) {
    el.textContent = message;
    el.style.display = 'block';
  }
  function clearError(el) {
    el.textContent = '';
    el.style.display = 'none';
  }

  // ログイン状態を IndexedDB に永続化(ポップアップを閉じても維持)。
  // ※ 認証状態の監視・ログイン処理より前に「await」で確実に適用する。
  //   これが未適用のままサインインするとセッションがメモリ上のみになり、
  //   ポップアップを閉じると失われる(=毎回ログインを求められる)。
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  } catch (e) {
    console.warn('setPersistence(LOCAL) に失敗しました:', e);
  }

  // 認証状態に応じて表示を切り替える
  auth.onAuthStateChanged((user) => {
    loadingView.style.display = 'none';
    if (user) {
      loginView.style.display = 'none';
      appView.style.display = 'block';
      currentUserEmail.textContent = user.email || 'ログイン中';
      // 現在のタブURLから動画IDを推測して初期入力
      if (chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs && tabs[0];
          if (tab && tab.url && !videoIdInput.value) {
            videoIdInput.value = extractVideoId(tab.url);
          }
        });
      }
    } else {
      loginView.style.display = 'block';
      appView.style.display = 'none';
    }
  });

  // ログイン
  loginButton.addEventListener('click', async () => {
    clearError(loginError);
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      showError(loginError, 'メールアドレスとパスワードを入力してください。');
      return;
    }
    loginButton.disabled = true;
    loginButton.textContent = 'ログイン中...';
    try {
      await auth.signInWithEmailAndPassword(email, password);
      passwordInput.value = '';
    } catch (e) {
      showError(loginError, 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'ログイン';
    }
  });

  // Google ログイン(MV3: launchWebAuthFlow で id_token を取得し Firebase に連携)
  // ※ Webアプリ型 OAuth クライアントを使用。リダイレクトURIに
  //   https://<拡張ID>.chromiumapp.org/ を GCP 側で許可しておく必要がある(M-4)。
  googleLoginButton.addEventListener('click', () => {
    clearError(loginError);
    googleLoginButton.disabled = true;
    googleLoginButton.textContent = 'ログイン中...';

    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        response_type: 'id_token',
        redirect_uri: REDIRECT_URI,
        scope: 'openid email profile',
        nonce: nonce,
        prompt: 'select_account',
      }).toString();

    const resetButton = () => {
      googleLoginButton.disabled = false;
      googleLoginButton.textContent = 'Googleでログイン';
    };

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (responseUrl) => {
      if (chrome.runtime.lastError || !responseUrl) {
        showError(
          loginError,
          'Googleログインに失敗しました。GCP の承認済みリダイレクトURIに次を登録してください: ' +
            REDIRECT_URI +
            (chrome.runtime.lastError ? '（' + chrome.runtime.lastError.message + '）' : '')
        );
        resetButton();
        return;
      }
      try {
        const hash = responseUrl.split('#')[1] || '';
        const idToken = new URLSearchParams(hash).get('id_token');
        if (!idToken) throw new Error('id_token が取得できませんでした');
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        await auth.signInWithCredential(credential);
        // 成功時は onAuthStateChanged が UI を切り替える
      } catch (e) {
        showError(loginError, 'Googleログインに失敗しました。もう一度お試しください。');
        resetButton();
      }
    });
  });

  // ログアウト
  logoutButton.addEventListener('click', async () => {
    await auth.signOut();
  });

  // 報告
  reportButton.addEventListener('click', async () => {
    clearError(reportError);
    const user = auth.currentUser;
    if (!user) {
      showError(reportError, 'ログインが必要です。');
      return;
    }

    const videoId = normalizeVideoId(videoIdInput.value);
    if (!videoId) {
      showError(reportError, '動画IDを入力してください。');
      return;
    }
    if (videoId.length > 50) {
      showError(reportError, '動画IDが長すぎます。正しい動画IDを入力してください。');
      return;
    }

    const selectedReasons = [];
    reasonCheckboxes.forEach((cb) => {
      if (cb.checked) selectedReasons.push(cb.value);
    });
    if (selectedReasons.length === 0) {
      showError(reportError, '少なくとも1つの理由を選択してください。');
      return;
    }

    const postData = {
      videoId: videoId,
      reasons: selectedReasons,
      authorId: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      reportCount: 0,
      negativeReviewCount: 0,
      source: 'extension',
    };
    const videoTitle = (videoTitleInput.value || '').trim();
    if (videoTitle) {
      postData.videoTitle = videoTitle;
    }

    reportButton.disabled = true;
    reportButton.textContent = '報告中...';
    try {
      // 同一ユーザーによる同一動画の重複報告を防ぐ
      const dup = await db.collection('posts')
        .where('videoId', '==', videoId)
        .where('authorId', '==', user.uid)
        .limit(1)
        .get();
      if (!dup.empty) {
        showError(reportError, 'あなたは既にこの動画を報告しています。');
        reportButton.disabled = false;
        reportButton.textContent = '報告';
        return;
      }

      await db.collection('posts').add(postData);
      reportForm.style.display = 'none';
      successMessage.style.display = 'block';
    } catch (e) {
      showError(reportError, '報告の送信に失敗しました。時間をおいて再度お試しください。');
      reportButton.disabled = false;
      reportButton.textContent = '報告';
    }
  });

  // 続けて報告
  if (reportAgainButton) {
    reportAgainButton.addEventListener('click', () => {
      videoIdInput.value = '';
      videoTitleInput.value = '';
      reasonCheckboxes.forEach((cb) => { cb.checked = false; });
      clearError(reportError);
      reportButton.disabled = false;
      reportButton.textContent = '報告';
      successMessage.style.display = 'none';
      reportForm.style.display = 'block';
    });
  }
});
