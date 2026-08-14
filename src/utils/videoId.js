/**
 * 動画ID(品番)の正規化ユーティリティ
 *
 * 投稿・検索・Chrome拡張の全経路で同じ正規化を通すことで、表記ゆれ
 * (大文字小文字・全角/半角・区切り文字・区切り無し)による検索ミスを防ぐ (C-1)。
 *
 * 正規化ルール:
 *   1. 全角英数記号 → 半角、全角スペース → 半角スペース
 *   2. 前後の空白除去
 *   3. 大文字化(品番は大文字が慣習)
 *   4. 区切り(空白 / アンダースコア / ドット / 連続ハイフン)→ 単一ハイフン
 *   5. 「英字+数字」で区切りが無い場合はハイフンを挿入(例: SSIS123 → SSIS-123)
 *
 * 例:
 *   "ssis-123"      → "SSIS-123"
 *   "ＳＳＩＳ－１２３" → "SSIS-123"
 *   "ssis 123"      → "SSIS-123"
 *   "ssis_123"      → "SSIS-123"
 *   "ssis123"       → "SSIS-123"
 *   "  abp-456  "   → "ABP-456"
 */
export function normalizeVideoId(input) {
  if (input === null || input === undefined) return '';

  let s = String(input);

  // 1. 全角英数記号(！-～)→ 半角
  s = s.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  // 全角スペース → 半角スペース(全角スペースの正規表現は意図的)
  // eslint-disable-next-line no-irregular-whitespace
  s = s.replace(/　/g, ' ');

  // 2 + 3. トリム + 大文字化
  s = s.trim().toUpperCase();

  if (s === '') return '';

  // 4. 区切り(空白/アンダースコア/ドット)→ ハイフン、連続ハイフンを1つに、両端のハイフン除去
  s = s.replace(/[\s_.]+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^-+|-+$/g, '');

  // 5. 「英字のみ + 数字のみ」で区切りが無い場合はハイフンを挿入
  const m = s.match(/^([A-Z]+)(\d+)$/);
  if (m) {
    s = `${m[1]}-${m[2]}`;
  }

  return s;
}
