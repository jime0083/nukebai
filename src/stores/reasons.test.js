import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useReasonsStore } from './reasons';

describe('reasons store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('getAllReasons が全カテゴリの理由を平坦化して返す', () => {
    const store = useReasonsStore();
    const all = store.getAllReasons();
    // 各理由に code / displayName / category / categoryId が付与される
    expect(all.length).toBeGreaterThan(0);
    for (const r of all) {
      expect(typeof r.code).toBe('string');
      expect(typeof r.displayName).toBe('string');
      expect(typeof r.category).toBe('string');
    }
  });

  it('BAD_CAMERA がマスタに含まれる(検索側との不整合を防ぐ回帰テスト)', () => {
    const store = useReasonsStore();
    const codes = store.getAllReasons().map((r) => r.code);
    expect(codes).toContain('BAD_CAMERA');
  });

  it('getReasonsByCode が指定コードの表示名を返す', () => {
    const store = useReasonsStore();
    const result = store.getReasonsByCode(['BAD_QUALITY', 'BAD_CAMERA']);
    const names = result.map((r) => r.displayName);
    expect(names).toContain('画質・音声が悪い');
    expect(names).toContain('カメラワークが悪い');
  });

  it('getReasonsByCode は不正入力に対して空配列を返す', () => {
    const store = useReasonsStore();
    expect(store.getReasonsByCode(null)).toEqual([]);
    expect(store.getReasonsByCode('not-array')).toEqual([]);
  });
});
