import { selectIsLoggedIn, selectLoginState, selectUserId } from '@/store/selectors/loginSelectors';
import { initialState as userGridInitialState } from '@/store/userSaveGridsSlice';

describe('loginSelectors', () => {
    const mockState = {
        login: {
            isLoggedIn: true,
            userId: 42,
            username: 'alice',
        },
        userGrid: userGridInitialState,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    it('selectLoginState returns the login slice', () => {
        expect(selectLoginState(mockState)).toEqual(mockState.login);
    });

    it('selectIsLoggedIn returns true when user is logged in', () => {
        expect(selectIsLoggedIn(mockState)).toBe(true);
    });

    it('selectIsLoggedIn returns false when user is not logged in', () => {
        const state = { ...mockState, login: { ...mockState.login, isLoggedIn: false } };
        expect(selectIsLoggedIn(state)).toBe(false);
    });

    it('selectUserId returns the userId if set', () => {
        expect(selectUserId(mockState)).toBe(42);
    });

    it('selectUserId returns undefined if userId is null', () => {
        const state = { ...mockState, login: { ...mockState.login, userId: null } };
        expect(selectUserId(state)).toBeUndefined();
    });

    it('selectUserId returns undefined if userId is undefined', () => {
        const state = { ...mockState, login: { ...mockState.login, userId: undefined } };
        expect(selectUserId(state)).toBeUndefined();
    });
});
