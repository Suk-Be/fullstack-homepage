import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuthInit } from '../../../hooks/auth/useAuthInit';
import * as LoggerModule from '../../../utils/logger';

// 1. Define all your mock functions within vi.hoisted
const {
    mockDispatch,
    mockLoginActionCreator,
    mockLogoutActionCreator,
    mockInitializeCookies,
    mockGetAxiosStatus,
    mockRequestMe,
} = vi.hoisted(() => {
    return {
        mockDispatch: vi.fn(),
        mockLoginActionCreator: vi.fn(() => ({ type: 'login/login' })),
        mockLogoutActionCreator: vi.fn(() => ({ type: 'login/logout' })),
        mockInitializeCookies: vi.fn(),
        mockGetAxiosStatus: vi.fn(),
        mockRequestMe: vi.fn(),
    };
});

vi.mock('../../../components/auth/SignUp/requestMe', () => {
    return {
        default: mockRequestMe,
    };
});

vi.mock('../../../plugins/initializeCookies', () => {
    return {
        default: mockInitializeCookies,
    };
});

vi.mock('../../../utils/logger', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../../utils/logger')>();
    return {
        ...actual, // Keep other exports like logRecoverableError
        getAxiosStatus: mockGetAxiosStatus, // Use your hoisted mock here
    };
});

vi.mock('../../../store/loginSlice', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../../store/loginSlice')>();
    return {
        ...actual,
        login: mockLoginActionCreator,
        logout: mockLogoutActionCreator,
    };
});

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

const mockLogRecoverableError = vi
    .spyOn(LoggerModule, 'logRecoverableError')
    .mockImplementation((): void => {});

describe('useAuthInit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Scenario 1: Successful initialization and session ---
    it('should initialize cookies, request user data, and dispatch login on success', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        mockRequestMe.mockResolvedValue({ success: true, someOtherData: '...' });
        renderHook(() => useAuthInit());

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);

            expect(mockLoginActionCreator).toHaveBeenCalledTimes(1);
            expect(mockLogoutActionCreator).not.toHaveBeenCalled();

            expect(mockDispatch).toHaveBeenCalledWith({ type: 'login/login' });
            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/logout' });

            expect(mockLogRecoverableError).not.toHaveBeenCalled();
            expect(mockGetAxiosStatus).not.toHaveBeenCalled();
        });
    });

    // --- Scenario 2: initializeCookies fails ---
    it('should dispatch logout and log error if initializeCookies fails', async () => {
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

            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/login' });
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
    it('should dispatch logout and log error if requestMe fails', async () => {
        mockInitializeCookies.mockResolvedValue(undefined);
        const requestMeError = new Error('Unauthorized');
        mockRequestMe.mockRejectedValue(requestMeError);

        renderHook(() => useAuthInit());

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);

            expect(mockLoginActionCreator).not.toHaveBeenCalled();
            expect(mockLogoutActionCreator).toHaveBeenCalledTimes(1);

            expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'login/login' });
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'login/logout' });

            expect(mockLogRecoverableError).toHaveBeenCalledWith({
                context: '[Auth] No active session found:',
                error: requestMeError,
            });
            expect(mockGetAxiosStatus).not.toHaveBeenCalled();
        });
    });
});
