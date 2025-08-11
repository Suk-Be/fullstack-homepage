import { useAuthInit } from '@/hooks/auth/useAuthInit';
import * as LoggerModule from '@/utils/logger';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest'; // Explicitly import Vitest globals

// 1. Define all your mock functions within vi.hoisted
const {
    mockDispatch,
    mockLoginActionCreator,
    mockLogoutActionCreator,
    mockResetUserGridActionCreator,
    mockInitializeCookies,
    mockGetAxiosStatus,
    mockRequestMe,
} = vi.hoisted(() => {
    return {
        mockDispatch: vi.fn(),
        mockLoginActionCreator: vi.fn(() => ({ type: 'login/forceLogin' })),
        mockLogoutActionCreator: vi.fn(() => ({ type: 'login/logout' })),
        mockResetUserGridActionCreator: vi.fn(() => ({ type: 'userGrid/resetUserGrid' })),
        mockInitializeCookies: vi.fn(),
        mockGetAxiosStatus: vi.fn(),
        mockRequestMe: vi.fn(),
    };
});

// Corrected mock path for requestMe
vi.mock('@/components/auth/api/requestMe', () => {
    return {
        default: mockRequestMe,
    };
});

// Corrected mock path for initializeCookies
vi.mock('@/utils/auth/initializeCookies', () => {
    return {
        default: mockInitializeCookies,
    };
});

vi.mock('@/utils/logger', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/utils/logger')>();
    return {
        ...actual, // Keep other exports like logRecoverableError
        getAxiosStatus: mockGetAxiosStatus, // Use your hoisted mock here
    };
});

vi.mock('@/store/loginSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/store/loginSlice')>();
    return {
        ...actual,
        forceLogin: mockLoginActionCreator,
        logout: mockLogoutActionCreator,
    };
});

vi.mock('@/store/userGridSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/store/userGridSlice')>();
    return {
        ...actual,
        resetUserGrid: mockResetUserGridActionCreator,
    };
});

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

// Spy on logRecoverableError after its module has been mocked (if necessary, though your current mock handles it)
// It's generally safer to spy on it after the module mock, or ensure the module mock returns the original.
const mockLogRecoverableError = vi
    .spyOn(LoggerModule, 'logRecoverableError')
    .mockImplementation((): void => {});

describe('useAuthInit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Re-mock implementation for spyOn after clearAllMocks if it was reset
        mockLogRecoverableError.mockImplementation((): void => {});
    });

    // --- Scenario 1: Successful initialization and session ---
    it('should initialize cookies, request user data, and dispatch login and userId on success', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        mockRequestMe.mockResolvedValue({ success: true, userId: 123 });
        renderHook(() => useAuthInit());

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);

            expect(mockLoginActionCreator).toHaveBeenCalledTimes(1);
            expect(mockLogoutActionCreator).not.toHaveBeenCalled();

            // expect(mockSetUserIdActionCreator).toHaveBeenCalledTimes(1);
            expect(mockResetUserGridActionCreator).not.toHaveBeenCalled();

            expect(mockDispatch).toHaveBeenCalledWith({ type: 'login/forceLogin' });
            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/logout' });

            expect(mockLogRecoverableError).not.toHaveBeenCalled();
            expect(mockGetAxiosStatus).not.toHaveBeenCalled();
        });
    });

    // --- Scenario 2: initializeCookies fails ---
    it('should dispatch logout, resetUserGrid and log error if initializeCookies fails', async () => {
        const mockAxiosError = new Error('Failed to initialize cookies');
        (mockAxiosError as any).isAxiosError = true;
        (mockAxiosError as any).response = { status: 401, data: 'Error Data' };
        mockInitializeCookies.mockRejectedValue(mockAxiosError);
        mockGetAxiosStatus.mockReturnValue(401);

        renderHook(() => useAuthInit());

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).not.toHaveBeenCalled();

            expect(mockLoginActionCreator).not.toHaveBeenCalled();
            expect(mockLogoutActionCreator).toHaveBeenCalledTimes(1);

            expect(mockResetUserGridActionCreator).toHaveBeenCalledTimes(1);

            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/forceLogin' });
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'login/logout' });

            expect(mockGetAxiosStatus).toHaveBeenCalledWith(mockAxiosError);
            expect(mockLogRecoverableError).toHaveBeenCalledWith({
                context: '[Auth] Failed to initialize cookies:',
                error: mockAxiosError,
                extra: { axiosStatus: 401 },
            });
        });
    });

    // --- Scenario 3: requestMe fails (no active session) ---
    it('should dispatch logout, resetUserGrid and log error if requestMe fails', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        const requestMeError = new Error('Unauthorized');
        mockRequestMe.mockRejectedValue(requestMeError);

        renderHook(() => useAuthInit());

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);

            expect(mockLoginActionCreator).not.toHaveBeenCalled();
            expect(mockLogoutActionCreator).toHaveBeenCalledTimes(1);

            expect(mockResetUserGridActionCreator).toHaveBeenCalledTimes(1);

            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/forceLogin' });
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'login/logout' });

            expect(mockLogRecoverableError).toHaveBeenCalledWith({
                context: '[Auth] No active session found:',
                error: requestMeError,
            });
            expect(mockGetAxiosStatus).not.toHaveBeenCalled();
        });
    });
});
