import { store, subscribeLogging } from '@/store';
import { forceLogin } from '@/store/loginSlice';
import { initialName, saveGrid } from '@/store/userSaveGridsSlice';
import { userLoggedAdmin } from '@/tests/mocks/api';
import { mockLoginStateAdminAction, mockSaveGridAction } from '@/tests/mocks/redux';
import * as logger from '@/utils/logger';
import { vi } from 'vitest';

vi.spyOn(logger, 'logReduxState');
subscribeLogging();

describe('store', () => {
    it('updates login state via rootReducer', () => {
        store.dispatch(forceLogin(mockLoginStateAdminAction));

        const state = store.getState().login;
        expect(state.isLoggedIn).toBe(true);
        expect(state.role).toBe('admin');
    });

    it('updates userGrid state via rootReducer', () => {
        store.dispatch({
            type: 'login/forceLogin',
            payload: { userId: userLoggedAdmin, role: 'admin' as const },
        });

        store.dispatch(saveGrid(mockSaveGridAction));

        const state = store.getState().userGrid;
        const newGrid = Object.values(state.savedGrids).find((g) => g.name === initialName);

        expect(newGrid).toBeDefined();
        expect(newGrid?.name).toBe(initialName);
    });

    it('calls logReduxState on state change', () => {
        store.dispatch(forceLogin(mockLoginStateAdminAction));

        expect(logger.logReduxState).toHaveBeenCalledWith(
            'login',
            expect.objectContaining({ isLoggedIn: true }),
        );
    });
});
