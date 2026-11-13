import requestMe from '@/components/auth/requests/requestMe';
import { BaseClient } from '@/plugins/axios';
import loginReducer from '@/store/loginSlice';
import { loginThunk } from '@/store/thunks/loginThunk';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ----------------------------
// 🔹 Mocks
// ----------------------------
vi.mock('@/plugins/axios', () => ({
    BaseClient: {
        post: vi.fn(),
    },
}));

vi.mock('@/components/auth/requests/requestMe');
vi.mock('@/utils/auth/initializeCookies');
vi.mock('@/utils/recaptcha/recaptchaToken');
vi.mock('@/utils/auth/resetCookiesOnResponseError');
vi.mock('@/utils/auth/setResponseValidationError');

const mockedBaseClientPost = vi.mocked(BaseClient.post);
const mockedRequestMe = vi.mocked(requestMe);
const mockedInitializeCookies = vi.mocked(initializeCookies);
const mockedGetRecaptchaToken = vi.mocked(getRecaptchaToken);
const mockedResetCookies = vi.mocked(resetCookiesOnResponseError);
const mockedSetValidationError = vi.mocked(setResponseValidationError);

// Store Helper
const makeStore = () =>
    configureStore({
        reducer: { login: loginReducer },
    });

describe('loginThunk', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully execute login, fetch user data via requestMe, and return success payload', async () => {
        mockedGetRecaptchaToken.mockResolvedValue('mock-recaptcha-token');
        mockedInitializeCookies.mockResolvedValue(undefined);
        mockedBaseClientPost.mockResolvedValue({
            data: { message: 'Login erfolgreich!' },
        });
        mockedRequestMe.mockResolvedValue({
            success: true,
            userId: 1,
            userName: 'Admin User',
            role: 'admin',
        });

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await store.dispatch(
            loginThunk({ email: 'admin@test.com', password: 'password123' }) as any,
        );

        expect(mockedGetRecaptchaToken).toHaveBeenCalled();
        expect(mockedInitializeCookies).toHaveBeenCalled();
        expect(mockedBaseClientPost).toHaveBeenCalledWith('/login', {
            email: 'admin@test.com',
            password: 'password123',
            recaptcha_token: 'mock-recaptcha-token',
        });
        expect(mockedRequestMe).toHaveBeenCalled();

        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual({
            success: true,
            message: 'Login erfolgreich!',
            userId: 1,
            userName: 'Admin User',
            role: 'admin',
        });
    });

    it('should reject with value if requestMe fails after a successful login post', async () => {
        mockedGetRecaptchaToken.mockResolvedValue('mock-recaptcha-token');
        mockedInitializeCookies.mockResolvedValue(undefined);
        mockedBaseClientPost.mockResolvedValue({
            data: { message: 'Login erfolgreich!' },
        });
        // requestMe schlägt fehl
        mockedRequestMe.mockResolvedValue({
            success: false,
            message: 'Fehler beim Laden',
        });

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await store.dispatch(
            loginThunk({ email: 'admin@test.com', password: 'wrong' }) as any,
        );

        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toEqual({
            success: false,
            message: 'Benutzer konnte nicht geladen werden',
        });
    });

    it('should catch exceptions, reset cookies on error, and return validation error', async () => {
        const networkError = new Error('Network Error');
        mockedGetRecaptchaToken.mockResolvedValue('mock-recaptcha-token');
        mockedInitializeCookies.mockRejectedValue(networkError);

        const errorResponse = { success: false, message: 'Validierungsfehler' };
        mockedSetValidationError.mockReturnValue(errorResponse as any);

        const store = makeStore();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await store.dispatch(
            loginThunk({ email: 'admin@test.com', password: 'password' }) as any,
        );

        expect(mockedResetCookies).toHaveBeenCalledWith(networkError);
        expect(mockedSetValidationError).toHaveBeenCalledWith(networkError);
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toEqual(errorResponse);
    });
});
