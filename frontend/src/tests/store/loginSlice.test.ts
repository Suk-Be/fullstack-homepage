import reducer, { LoginState, loginThunk } from '@/store/loginSlice';
import { userLoggedInNoAdmin } from '@/tests/mocks/api';
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted Mocks
const {
    mockRequestMe,
    mockInitializeCookies,
    mockPost,
    mockResetCookiesOnResponseError,
    mockSetResponseValidationError,
} = vi.hoisted(() => ({
    mockRequestMe: vi.fn(),
    mockInitializeCookies: vi.fn(),
    mockPost: vi.fn(),
    mockResetCookiesOnResponseError: vi.fn(),
    mockSetResponseValidationError: vi.fn(),
}));

// Mocks definieren
vi.mock('@/plugins/axios', () => {
    return {
        BaseClient: {
            post: mockPost,
            defaults: { baseURL: 'http://localhost:8000' }, // optional, falls du GET mal brauchst
        },
    };
});

vi.mock('@/utils/auth/initializeCookies', () => ({
    default: mockInitializeCookies,
}));

vi.mock('@/components/auth/requests/requestMe', () => ({
    default: mockRequestMe,
}));

vi.mock('@/utils/auth/resetCookiesOnResponseError', () => ({
    default: mockResetCookiesOnResponseError,
}));

vi.mock('@/store/userGridSlice', () => ({
    resetUserGrid: () => ({ type: 'userGrid/resetUserGrid' }),
}));

vi.mock('@/utils/auth/setResponseValidationError', () => ({
    setResponseValidationError: mockSetResponseValidationError,
}));

// Store-Helper
const makeStore = () =>
    configureStore({
        reducer: { login: reducer },
    });

// Tests
describe('loginThunk', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should login successfully and update state', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        mockPost.mockResolvedValue({ data: { message: 'Welcome' } });
        mockRequestMe.mockResolvedValue({ success: true, userId: 42, role: userLoggedInNoAdmin });

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await store.dispatch(loginThunk({ email: 'test@example.com', password: 'secret' }) as any);

        const state: LoginState = store.getState().login;
        expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith('/login', {
            email: 'test@example.com',
            password: 'secret',
        });
        expect(mockRequestMe).toHaveBeenCalledTimes(1);
        expect(state.isLoggedIn).toBe(true);
        expect(state.userId).toBe(42);
        expect(state.isLoading).toBe(false);
    });

    it('should handle failed requestMe and set error', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        mockPost.mockResolvedValue({ data: {} });
        mockRequestMe.mockResolvedValue({ success: false });

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await store.dispatch(loginThunk({ email: 'fail@example.com', password: 'wrong' }) as any);

        const state: LoginState = store.getState().login;
        expect(state.isLoggedIn).toBe(false);
        expect(state.error).toBe('Benutzer konnte nicht geladen werden');
        expect(state.isLoading).toBe(false);
    });

    it('should handle thrown error and call resetCookiesOnResponseError', async () => {
        const errorObj = new Error('network fail');
        mockInitializeCookies.mockRejectedValue(errorObj);
        mockSetResponseValidationError.mockReturnValue({
            success: false,
            message: 'Validation error',
        });

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await store.dispatch(loginThunk({ email: 'oops@example.com', password: 'fail' }) as any);

        expect(mockResetCookiesOnResponseError).toHaveBeenCalledWith(errorObj);
        const state: LoginState = store.getState().login;
        expect(state.error).toBe('Validation error');
        expect(state.isLoggedIn).toBe(false);
    });
});
