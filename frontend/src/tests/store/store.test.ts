import { store } from '@/store';
import { forceLogin, logout } from '@/store/loginSlice';
import {
    persistGridsinLocalStorage,
    resetUserGrid,
    saveInitialGridAsUUID,
    updateInitialGrid,
} from '@/store/userSaveGridsSlice';
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

        // 1. initial Grid anpassen
        store.dispatch(updateInitialGrid({ layoutId: 'initial', key: 'items', value: '4' }));
        store.dispatch(updateInitialGrid({ layoutId: 'initial', key: 'columns', value: '2' }));
        store.dispatch(updateInitialGrid({ layoutId: 'initial', key: 'gap', value: '1' }));

        // 2. neues Grid speichern
        store.dispatch(saveInitialGridAsUUID());

        const state = store.getState();

        // initial + neues Grid = 2
        expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(2);

        const savedGrids = state.userGrid.savedGrids;
        const keys = Object.keys(savedGrids);
        const secondKey = keys.find((k) => k !== 'initial')!;
        const secondGrid = savedGrids[secondKey];

        expect(secondGrid.config.items).toBe('4');
        expect(secondGrid.config.columns).toBe('2');
        expect(secondGrid.config.gap).toBe('1');
    });

    it('should reset all grids when resetUserGrid is dispatched', () => {
        store.dispatch(forceLogin(123));

        // initial bearbeiten
        store.dispatch(updateInitialGrid({ layoutId: 'initial', key: 'items', value: '5' }));
        store.dispatch(updateInitialGrid({ layoutId: 'initial', key: 'columns', value: '3' }));

        // speichern
        store.dispatch(saveInitialGridAsUUID());

        // reset
        store.dispatch(resetUserGrid());

        const state = store.getState();

        // nur noch das initial-Grid übrig
        expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(1);
        expect(state.userGrid.savedGrids).toHaveProperty('initial');
    });
});
