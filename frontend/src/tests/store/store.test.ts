import { store } from '@/store';
import { forceLogin, logout } from '@/store/loginSlice';
import {
  getGridsFromLocalStorage,
  resetUserGrids,
  saveInitialGrid,
  updateGridConfig,
} from '@/store/userSaveGridsSlice';
import { beforeEach, describe, expect, it } from 'vitest';
import { userLoggedAdmin, userLoggedInNoAdmin } from '../mocks/handlers';

describe('Redux Store', () => {
    beforeEach(() => {
        store.dispatch(logout());
        store.dispatch(resetUserGrids(userLoggedAdmin));
    });

    it('should have the correct initial state', () => {
        const state = store.getState();
        expect(state.login.isLoggedIn).toBe(false);
        expect(state.login.userId).toBeUndefined();

        expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(1);
        expect(state.userGrid.savedGrids.initial.layoutId).toBe('initial');
    });

    it('should update login state when forceLogin is dispatched', () => {
        store.dispatch(forceLogin({userId: userLoggedInNoAdmin, role: 'user'}));

        const state = store.getState();
        expect(state.login.isLoggedIn).toBe(true);
        expect(state.login.userId).toBe(userLoggedInNoAdmin);
    });

    it('should reset login state when logout is dispatched', () => {
        store.dispatch(forceLogin({userId: userLoggedInNoAdmin, role: 'user'}));
        store.dispatch(logout());

        const state = store.getState();
        expect(state.login.isLoggedIn).toBe(false);
        expect(state.login.userId).toBeUndefined();
    });

    it('should add a grid for a logged-in user', () => {
        store.dispatch(forceLogin({userId: userLoggedInNoAdmin, role: 'user'}));
        store.dispatch(getGridsFromLocalStorage(userLoggedInNoAdmin));

        // 1. initial Grid anpassen
        store.dispatch(updateGridConfig({ layoutId: 'initial', key: 'items', value: '4' }));
        store.dispatch(updateGridConfig({ layoutId: 'initial', key: 'columns', value: '2' }));
        store.dispatch(updateGridConfig({ layoutId: 'initial', key: 'gap', value: '1' }));

        // 2. neues Grid speichern, überschreibt layoutId mit uuid
        store.dispatch(saveInitialGrid('layoutName'));

        const state = store.getState();

        // initial + neues Grid = 2
        expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(2);

        const savedGrids = state.userGrid.savedGrids;
        const keys = Object.keys(savedGrids);
        // no initial
        const secondKey = keys.find((k) => k !== 'initial')!;
        const secondGrid = savedGrids[secondKey];

        expect(secondGrid.config.items).toBe('4');
        expect(secondGrid.config.columns).toBe('2');
        expect(secondGrid.config.gap).toBe('1');
    });

    it('should reset all grids when resetUserGrid is dispatched', () => {
        store.dispatch(forceLogin({userId: userLoggedAdmin, role: 'admin'}));

        // initial bearbeiten
        store.dispatch(updateGridConfig({ layoutId: 'initial', key: 'items', value: '5' }));
        store.dispatch(updateGridConfig({ layoutId: 'initial', key: 'columns', value: '3' }));

        // speichern
        store.dispatch(saveInitialGrid('layout name'));

        // reset
        store.dispatch(resetUserGrids(userLoggedAdmin));

        const state = store.getState();

        // nur noch das initial-Grid übrig
        expect(Object.keys(state.userGrid.savedGrids)).toHaveLength(1);
        expect(state.userGrid.savedGrids).toHaveProperty('initial');
    });
});
