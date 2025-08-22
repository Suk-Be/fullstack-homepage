import { store } from '@/store';
import { forceLogin, logout } from '@/store/loginSlice';
import { addGrid, persistGridsinLocalStorage, resetUserGrid } from '@/store/userSaveGridsSlice';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Redux Store', () => {
  beforeEach(() => {
    store.dispatch(logout());
    store.dispatch(resetUserGrid());
  });

  it('should have the correct initial state', () => {
    const state = store.getState();
    expect(state.login.isLoggedIn).toBe(false);
    expect(state.login.userId).toBeUndefined();

    expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(1);
    expect(state.userGrid.savedGrids.initial.layoutId).toBe('initial');
  });

  it('should update login state when forceLogin is dispatched', () => {
    store.dispatch(forceLogin(123));

    const state = store.getState();
    expect(state.login.isLoggedIn).toBe(true);
    expect(state.login.userId).toBe(123);
  });

  it('should reset login state when logout is dispatched', () => {
    store.dispatch(forceLogin(123));
    store.dispatch(logout());

    const state = store.getState();
    expect(state.login.isLoggedIn).toBe(false);
    expect(state.login.userId).toBeUndefined();
  });

  it('should add a grid for a logged-in user', () => {
    store.dispatch(forceLogin(123));
    store.dispatch(persistGridsinLocalStorage(123));

    store.dispatch(
      addGrid({
        config: {
          items: '4',
          columns: '2',
          gap: '1',
          border: '0',
          paddingX: '0',
          paddingY: '0',
        },
      })
    );

    const state = store.getState();
  
    expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(2);

    const savedGrids  = state.userGrid.savedGrids
    const keys = Object.keys(savedGrids);
    const secondKey = keys[1];
    const secondGrid = savedGrids[secondKey];
    expect(secondGrid.config.items).toBe('4');
  });

  it('should reset all grids when resetUserGrid is dispatched', () => {
    store.dispatch(forceLogin(123));
    store.dispatch(
      addGrid({
        config: { items: '5', columns: '3', gap: '1', border: '0', paddingX: '0', paddingY: '0' },
      })
    );

    store.dispatch(resetUserGrid());

    const state = store.getState();
    expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(1);
  });
});
