import loginReducer, { login, logout } from '@/store/loginSlice';

describe('loginSlice', () => {
    it('should return the initial state', () => {
        // reducer is called with undefined (not an state object) with an INIT action
        // since redux does not know what to do with it. it returns the default state
        expect(loginReducer(undefined, { type: '@@INIT' })).toEqual({
            isLoggedIn: false,
            isLoading: true,
        });
    });

    it('should login when login is dispatched', () => {
        expect(loginReducer({ isLoggedIn: false, isLoading: false }, login())).toEqual({
            isLoggedIn: true,
            isLoading: false
        });
    });

    it('should logout when logout is dispatched', () => {
        expect(loginReducer({ isLoggedIn: true, isLoading: false }, logout())).toEqual({
            isLoggedIn: false,
            isLoading: false
        });
    });
});
