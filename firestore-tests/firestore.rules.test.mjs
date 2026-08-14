/**
 * Firestore セキュリティルールの単体テスト (Work 2-2)
 *
 * 実行には Java ランタイム + Firestore エミュレータが必要:
 *   1) npm i -D @firebase/rules-unit-testing vitest
 *   2) firebase emulators:exec --only firestore "npx vitest run firestore-tests"
 *
 * ※ 本プロジェクトのテスト基盤(Vitest)整備は Phase 6 Work 6-1 で行う。
 *   本ファイルはルールの意図する挙動を明文化し、Java 環境で検証できるようにするもの。
 */
import { readFileSync } from 'fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setDoc, getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { beforeAll, afterAll, beforeEach, describe, test } from 'vitest';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'nukebuy-rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

function authedDb(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}
function anonDb() {
  return testEnv.unauthenticatedContext().firestore();
}

describe('posts', () => {
  test('未認証は読み取り不可', async () => {
    await assertFails(getDoc(doc(anonDb(), 'posts/p1')));
  });

  test('認証済みは読み取り可', async () => {
    await assertSucceeds(getDoc(doc(authedDb('alice'), 'posts/p1')));
  });

  test('authorId が自分なら有効な投稿を作成できる', async () => {
    await assertSucceeds(
      addDoc(collection(authedDb('alice'), 'posts'), {
        authorId: 'alice',
        videoId: 'ABCD-123',
        reasons: ['BAD_QUALITY'],
        videoTitle: 'サンプル',
      })
    );
  });

  test('authorId が他人の投稿は作成不可', async () => {
    await assertFails(
      addDoc(collection(authedDb('alice'), 'posts'), {
        authorId: 'bob',
        videoId: 'ABCD-123',
        reasons: ['BAD_QUALITY'],
      })
    );
  });

  test('videoId 欠落は作成不可', async () => {
    await assertFails(
      addDoc(collection(authedDb('alice'), 'posts'), {
        authorId: 'alice',
        reasons: ['BAD_QUALITY'],
      })
    );
  });

  test('videoTitle 無し(任意)でも作成可', async () => {
    await assertSucceeds(
      addDoc(collection(authedDb('alice'), 'posts'), {
        authorId: 'alice',
        videoId: 'ABCD-123',
        reasons: ['BAD_QUALITY'],
      })
    );
  });
});

describe('users', () => {
  test('本人が points:0 で作成できる', async () => {
    await assertSucceeds(
      setDoc(doc(authedDb('alice'), 'users/alice'), {
        email: 'a@example.com',
        role: 'user',
        subscriptionStatus: 'free',
        points: 0,
        reportCount: 0,
      })
    );
  });

  test('points を盛って作成するのは不可', async () => {
    await assertFails(
      setDoc(doc(authedDb('alice'), 'users/alice'), {
        email: 'a@example.com',
        points: 100000,
      })
    );
  });

  test('lastLoginAt の更新は可(保護フィールド不変)', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users/alice'), {
        email: 'a@example.com',
        role: 'user',
        subscriptionStatus: 'free',
        points: 50,
        reportCount: 3,
        totalPosts: 3,
        searchCount: 0,
        isUnlimited: false,
      });
    });
    await assertSucceeds(
      setDoc(doc(authedDb('alice'), 'users/alice'), { lastLoginAt: 'now' }, { merge: true })
    );
  });

  test('points の自己更新は不可', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users/alice'), {
        email: 'a@example.com',
        role: 'user',
        subscriptionStatus: 'free',
        points: 50,
        reportCount: 3,
        totalPosts: 3,
        searchCount: 0,
        isUnlimited: false,
      });
    });
    await assertFails(
      setDoc(doc(authedDb('alice'), 'users/alice'), { points: 999999 }, { merge: true })
    );
  });

  test('他人のドキュメントは読めない', async () => {
    await assertFails(getDoc(doc(authedDb('alice'), 'users/bob')));
  });
});

describe('extension_reports', () => {
  test('新規 write は不可(posts へ統一済み)', async () => {
    await assertFails(
      addDoc(collection(authedDb('alice'), 'extension_reports'), {
        userId: 'alice',
        videoId: 'ABCD-123',
      })
    );
  });
});
