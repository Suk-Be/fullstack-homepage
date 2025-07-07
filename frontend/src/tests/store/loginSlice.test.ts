import loginReducer, { login, logout } from '../../store/loginSlice';

describe('loginSlice', () => {
    it('should return the initial state', () => {
        // reducer is called with undefined (not an state object) with an INIT action
        // since redux does not know what to do with it. it returns the default state
        expect(loginReducer(undefined, { type: '@@INIT' })).toEqual({
            isLoggedIn: false,
        });
    });

    it('should login when login is dispatched', () => {
        expect(loginReducer({ isLoggedIn: false }, login())).toEqual({
            isLoggedIn: true,
        });
    });

    it('should logout when logout is dispatched', () => {
        expect(loginReducer({ isLoggedIn: true }, logout())).toEqual({
            isLoggedIn: false,
        });
    });
});
