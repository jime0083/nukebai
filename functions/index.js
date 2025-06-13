// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Firebase初期化
if (!admin.apps.length) {
    admin.initializeApp();
}

// サンプル関数
exports.helloWorld = functions.region("asia-northeast1").https.onCall((data, context) => {
    return { message: "Hello from Firebase!" };
});

