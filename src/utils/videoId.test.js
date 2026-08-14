import { describe, it, expect } from 'vitest';
import { normalizeVideoId } from './videoId.js';

describe('normalizeVideoId', () => {
  const cases = [
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

  it.each(cases)('normalizeVideoId(%o) === %o', (input, expected) => {
    expect(normalizeVideoId(input)).toBe(expected);
  });
});
