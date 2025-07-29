import loginReducer, { login, LoginState, logout, setUserId } from '@/store/loginSlice';

describe('loginSlice', () => {
    const initialState: LoginState = {
        userId: null,
        isLoggedIn: false,
        isLoading: true,
    };

    it('should return the initial state', () => {
        expect(loginReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle login', () => {
        const prevState: LoginState = {
            userId: null,
            isLoggedIn: false,
            isLoading: true,
        };

        expect(loginReducer(prevState, login())).toEqual({
            userId: null,
            isLoggedIn: true,
            isLoading: false,
        });
    });

    it('should handle logout', () => {
        const prevState: LoginState = {
            userId: 123,
            isLoggedIn: true,
            isLoading: false,
        };

        expect(loginReducer(prevState, logout())).toEqual({
            userId: 123,
            isLoggedIn: false,
            isLoading: false,
        });
    });

    it('should handle setUserId', () => {
        const prevState: LoginState = {
            userId: null,
            isLoggedIn: false,
            isLoading: true,
        };

        expect(loginReducer(prevState, setUserId(42))).toEqual({
            userId: 42,
            isLoggedIn: false,
            isLoading: true,
        });
    });
});
