import {
    selectIsLoggedIn,
    selectLoginState,
    selectUserId,
    selectUserInitials,
} from '@/store/selectors/loginSelectors';
import { initialState as userGridInitialState } from '@/store/userSaveGridsSlice';

describe('loginSelectors', () => {
    const mockState = {
        login: {
            isLoggedIn: true,
            userId: 42,
            userName: 'Admin User',
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

    describe('selectUserInitials', () => {
        it('returns initials from first and last name (two words)', () => {
            const state = { ...mockState, login: { ...mockState.login, userName: 'John Doe' } };
            expect(selectUserInitials(state)).toBe('JD');
        });

        it('returns first two letters if only one word is provided', () => {
            const state = { ...mockState, login: { ...mockState.login, userName: 'Admin' } };
            expect(selectUserInitials(state)).toBe('AD');
        });

        it('returns first two letters uppercase even if lowercase', () => {
            const state = {
                ...mockState,
                login: { ...mockState.login, userName: 'max mustermann' },
            };
            expect(selectUserInitials(state)).toBe('MM');
        });

        it('returns "U" as fallback if userName is missing or empty', () => {
            const stateNull = { ...mockState, login: { ...mockState.login, userName: null } };
            const stateUndefined = {
                ...mockState,
                login: { ...mockState.login, userName: undefined },
            };
            const stateEmpty = { ...mockState, login: { ...mockState.login, userName: '   ' } };

            expect(selectUserInitials(stateNull)).toBe('U');
            expect(selectUserInitials(stateUndefined)).toBe('U');
            expect(selectUserInitials(stateEmpty)).toBe('U');
        });
    });
});
