import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './user';

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('初期状態は未ログイン', () => {
    const store = useUserStore();
    expect(store.isLoggedIn).toBe(false);
    expect(store.canPerformSearch).toBe(false);
    expect(store.canSubmitReport).toBe(false);
  });

  it('setUser でログイン状態・プロフィールが反映される', () => {
    const store = useUserStore();
    store.setUser({ uid: 'u1', email: 'a@example.com', role: 'user', points: 30, subscriptionStatus: 'free' });
    expect(store.isLoggedIn).toBe(true);
    expect(store.points).toBe(30);
    expect(store.isAdmin).toBe(false);
    // ログインすれば検索・報告が可能(Q-b: ログイン必須)
    expect(store.canPerformSearch).toBe(true);
    expect(store.canSubmitReport).toBe(true);
  });

  it('admin ロールは isAdmin が true', () => {
    const store = useUserStore();
    store.setUser({ uid: 'admin1', email: 'admin@example.com', role: 'admin' });
    expect(store.isAdmin).toBe(true);
  });

  it('clearUser でログアウト状態に戻る', () => {
    const store = useUserStore();
    store.setUser({ uid: 'u1', email: 'a@example.com', points: 30 });
    store.clearUser();
    expect(store.isLoggedIn).toBe(false);
    expect(store.points).toBe(0);
    expect(store.canPerformSearch).toBe(false);
  });

  it('isPaidUser は subscriptionStatus が free/null 以外のときに true', () => {
    const store = useUserStore();
    store.setUser({ uid: 'u1', email: 'a@example.com', subscriptionStatus: 'active' });
    expect(store.isPaidUser).toBe(true);
    store.updateSubscription('free');
    expect(store.isPaidUser).toBe(false);
  });
});
