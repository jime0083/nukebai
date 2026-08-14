/**
 * posts コレクションの videoId を正規化するマイグレーション (Work 3-4 / C-3)
 *
 * 【重要・安全設計】
 *  - デフォルトは dry-run(読み取りのみ)。--apply を付けたときだけ書き込む。
 *  - 変更するフィールドは videoId のみ(updateMask=videoId)。他フィールドは一切触れない
 *    → 既存の報告データ(reasons, authorId, createdAt 等)は保持される。
 *  - 正規化ロジックは src/utils/videoId.js を import(投稿・検索・拡張と同一ロジック)。
 *  - 認証は firebase-tools のログイントークン(configstore)を利用し Firestore REST を叩く。
 *    このトークンは cloud-platform スコープ(プロジェクト権限)のためルールをバイパスして
 *    全 posts を更新できる。
 *
 * 実行方法:
 *   dry-run(既定):  node scripts/migrate-videoid.mjs
 *   実際に適用:      node scripts/migrate-videoid.mjs --apply
 *
 * ※本番データを書き換えるため、--apply は必ずユーザー承認の上で実行すること。
 *   まず dry-run 結果(変更件数・before→after)を確認する。
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { normalizeVideoId } from '../src/utils/videoId.js';

const PROJECT = 'nukebuy';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const APPLY = process.argv.includes('--apply');

function getAccessToken() {
  const p = `${homedir()}/.config/configstore/firebase-tools.json`;
  const conf = JSON.parse(readFileSync(p, 'utf8'));
  const token = conf.tokens && conf.tokens.access_token;
  const expires = conf.tokens && conf.tokens.expires_at;
  if (!token) throw new Error('firebase-tools のアクセストークンが見つかりません。`firebase login` を実行してください。');
  if (expires && expires < Date.now()) {
    throw new Error('アクセストークンが期限切れです。`firebase login --reauth` で更新してください。');
  }
  return token;
}

async function api(path, options = {}) {
  const token = getAccessToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function listAllPosts() {
  const docs = [];
  let pageToken = '';
  do {
    const url = `${BASE}/posts?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const data = await api(url);
    (data.documents || []).forEach((d) => docs.push(d));
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return docs;
}

async function patchVideoId(docName, newVideoId) {
  // docName は "projects/.../documents/posts/{id}" のフルパス
  const url = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=videoId`;
  await api(url, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { videoId: { stringValue: newVideoId } } }),
  });
}

async function main() {
  console.log(`=== videoId マイグレーション (${APPLY ? '★APPLY(本番書込)' : 'dry-run(読取のみ)'}) ===`);
  const posts = await listAllPosts();
  console.log(`posts 総数: ${posts.length}`);

  const changes = [];
  let missing = 0;
  for (const doc of posts) {
    const fields = doc.fields || {};
    const current = fields.videoId && fields.videoId.stringValue;
    if (current === undefined) {
      missing++;
      continue;
    }
    const normalized = normalizeVideoId(current);
    if (normalized && normalized !== current) {
      changes.push({ name: doc.name, id: doc.name.split('/').pop(), before: current, after: normalized });
    }
  }

  console.log(`videoId フィールドが無い doc: ${missing}`);
  console.log(`正規化で変更が必要な doc: ${changes.length}`);
  console.log('--- 変更プレビュー(先頭50件) ---');
  changes.slice(0, 50).forEach((c) => console.log(`  ${c.id}: "${c.before}" -> "${c.after}"`));

  if (!APPLY) {
    console.log('\n(dry-run のため書き込みはしていません。適用するには --apply を付けて実行)');
    return;
  }

  console.log('\n--apply 指定のため書き込みを開始します...');
  let ok = 0;
  let fail = 0;
  for (const c of changes) {
    try {
      await patchVideoId(c.name, c.after);
      ok++;
    } catch (e) {
      fail++;
      console.error(`  FAIL ${c.id}: ${e.message}`);
    }
  }
  console.log(`完了: 成功 ${ok} / 失敗 ${fail}`);
}

main().catch((e) => {
  console.error('マイグレーション中にエラー:', e.message);
  process.exit(1);
});
