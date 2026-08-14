/**
 * normalizeVideoId の単体テスト
 * 実行: node src/utils/videoId.test.mjs
 * ※ Phase 6 で Vitest 基盤に統合予定。現状は Node 単体で実行可能。
 */
import assert from 'node:assert/strict';
import { normalizeVideoId } from './videoId.js';

const cases = [
  // [入力, 期待値]
  ['ssis-123', 'SSIS-123'],
  ['SSIS-123', 'SSIS-123'],
  ['ssis123', 'SSIS-123'],
  ['ssis 123', 'SSIS-123'],
  ['ssis_123', 'SSIS-123'],
  ['ssis.123', 'SSIS-123'],
  ['  abp-456  ', 'ABP-456'],
  ['ＳＳＩＳ－１２３', 'SSIS-123'], // 全角
  ['ＳＳＩＳ１２３', 'SSIS-123'], // 全角・区切り無し
  ['ssis--123', 'SSIS-123'], // 連続ハイフン
  ['-ssis-123-', 'SSIS-123'], // 両端ハイフン
  ['1pondo-123456', '1PONDO-123456'], // 数字始まりは分割しない
  ['ABCD', 'ABCD'], // 英字のみ
  ['12345', '12345'], // 数字のみ
  ['', ''],
  [null, ''],
  [undefined, ''],
  ['  ', ''],
];

let passed = 0;
let failed = 0;
for (const [input, expected] of cases) {
  const actual = normalizeVideoId(input);
  try {
    assert.equal(actual, expected);
    passed++;
  } catch {
    failed++;
    console.error(`FAIL: normalizeVideoId(${JSON.stringify(input)}) = ${JSON.stringify(actual)} (expected ${JSON.stringify(expected)})`);
  }
}

console.log(`videoId normalize tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
