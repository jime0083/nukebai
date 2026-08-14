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
