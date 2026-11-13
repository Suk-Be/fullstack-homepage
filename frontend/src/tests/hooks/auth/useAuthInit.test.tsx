import requestMe from '@/components/auth/requests/requestMe';
import { useAuthInit } from '@/hooks/auth/useAuthInit';
import { logout } from '@/store/loginSlice';
import { resetUserGrids } from '@/store/userSaveGridsSlice';
import { userLoggedInNoAdmin } from '@/tests/mocks/api';
import { authTestStates } from '@/tests/utils/authTestStates';
import { renderHookWithProviders } from '@/tests/utils/testRenderUtils';
import initializeCookies from '@/utils/auth/initializeCookies';
import * as dispatchHelper from '@/utils/redux/dispatchHelper';
import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ----------------------------
// 🔹 Module Mocks
// ----------------------------
vi.mock('@/components/auth/requests/requestMe');
vi.mock('@/utils/auth/initializeCookies');

vi.mock('@/store/loginSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/store/loginSlice')>();
    return {
        ...actual,
        forceLogin: vi.fn((payload) => ({ type: 'login/forceLogin', ...payload })),
        logout: vi.fn(() => ({ type: 'login/logout' })),
        startAuth: vi.fn(() => ({ type: 'login/startAuth' })),
    };
});

vi.mock('@/store/userSaveGridsSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/store/userSaveGridsSlice')>();
    return {
        ...actual,
        resetUserGrids: vi.fn((userId: number) => ({
            type: 'userGrid/resetUserGrids',
            payload: userId,
        })),
    };
});

vi.mock('@/utils/redux/dispatchHelper', () => ({
    dispatchForceLogin: vi.fn((dispatch, userData) => {
        dispatch({ type: 'login/forceLogin', ...userData });
    }),
}));

vi.mock(import('@/utils/logger'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        logRecoverableError: vi.fn(),
        logReduxState: vi.fn(),
        logRequestState: vi.fn(),
    };
});

// Zugriff auf die gemockten Funktionen
const mockDispatch = vi.fn();
const mockedRequestMe = vi.mocked(requestMe);
const mockedInitializeCookies = vi.mocked(initializeCookies);
const mockedDispatchForceLogin = vi.mocked(dispatchHelper.dispatchForceLogin);
const mockedResetUserGrids = vi.mocked(resetUserGrids);
const mockedLogout = vi.mocked(logout);

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return { ...actual, useDispatch: () => mockDispatch };
});

describe('useAuthInit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes cookies, requests user data, and dispatches login on success', async () => {
        mockedInitializeCookies.mockResolvedValue(undefined);
        mockedRequestMe.mockResolvedValue({
            success: true,
            userId: userLoggedInNoAdmin,
            userName: 'Mock User',
            role: 'user',
        });

        renderHookWithProviders(() => useAuthInit(), { preloadedState: authTestStates.null });

        await waitFor(() => {
            expect(mockedInitializeCookies).toHaveBeenCalled();
            expect(mockedRequestMe).toHaveBeenCalled();
            expect(mockedDispatchForceLogin).toHaveBeenCalledWith(
                expect.any(Function),
                expect.objectContaining({
                    userId: userLoggedInNoAdmin,
                    userName: 'Mock User',
                    role: 'user',
                }),
            );
        });
    });

    it('dispatches logout + resetUserGrid if initializeCookies fails', async () => {
        mockedInitializeCookies.mockRejectedValue(new Error('Cookie failure'));

        // 🔹 Act: Hook rendern mit "nicht eingeloggtem" Zustand,
        // damit der Guard initAuth() ausführt
        renderHookWithProviders(() => useAuthInit(), {
            preloadedState: {
                login: {
                    isLoggedIn: false,
                    userId: userLoggedInNoAdmin,
                    role: 'user',
                    isLoading: false,
                    error: null,
                    fieldErrors: undefined,
                },
                userGrid: authTestStates.user.userGrid,
            },
        });

        await waitFor(() => {
            expect(mockedInitializeCookies).toHaveBeenCalled();
            expect(mockedRequestMe).not.toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledWith(mockedResetUserGrids(userLoggedInNoAdmin));
            expect(mockDispatch).toHaveBeenCalledWith(mockedLogout());
        });
    });

    it('does nothing if already logged in (admin)', async () => {
        mockedInitializeCookies.mockResolvedValue(undefined);
        renderHookWithProviders(() => useAuthInit(), {
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    userId: userLoggedInNoAdmin,
                    role: 'user',
                    isLoading: false,
                    error: null,
                    fieldErrors: undefined,
                },
                userGrid: authTestStates.user.userGrid,
            },
        });

        await waitFor(() => {
            expect(mockedInitializeCookies).not.toHaveBeenCalled();
            expect(mockedRequestMe).not.toHaveBeenCalled();
            expect(mockedDispatchForceLogin).not.toHaveBeenCalled();
            expect(mockDispatch).not.toHaveBeenCalledWith(
                mockedResetUserGrids(userLoggedInNoAdmin),
            );
            expect(mockDispatch).not.toHaveBeenCalledWith(mockedLogout());
        });
    });
});
