import { useAuthInit } from '@/hooks/auth/useAuthInit';
import loginReducer, { LoginState } from '@/store/loginSlice';
import userSaveGridsReducer from '@/store/userSaveGridsSlice';
import { userLoggedAdmin } from '@/tests/mocks/handlers';
import { UserSaveGridsState } from '@/types/Redux';
import { configureStore, Reducer } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ----------------------------
// 🔹 Hoisted Mocks
// ----------------------------
const {
  mockLogRecoverableError,
  mockRequestMe,
  mockInitializeCookies,
  mockLoginActionCreator,
  mockLogoutActionCreator,
  mockResetUserGridActionCreator,
} = vi.hoisted(() => ({
  mockLogRecoverableError: vi.fn(),
  mockRequestMe: vi.fn(),
  mockInitializeCookies: vi.fn(),
  mockLoginActionCreator: vi.fn(() => ({ type: 'login/forceLogin' })),
  mockLogoutActionCreator: vi.fn(() => ({ type: 'login/logout' })),
  mockResetUserGridActionCreator: vi.fn(() => ({ type: 'userGrid/resetUserGrids' })),
}));

// ----------------------------
// 🔹 Vitest Module Mocks
// ----------------------------
vi.mock('@/components/auth/api/requestMe', () => ({
  default: mockRequestMe,
}));

vi.mock('@/utils/auth/initializeCookies', () => ({
  default: mockInitializeCookies,
}));

vi.mock('@/utils/logger', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/logger')>();
  return {
    ...actual,
    logRecoverableError: mockLogRecoverableError,
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

vi.mock('@/store/userSaveGridsSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/userSaveGridsSlice')>();
  return {
    ...actual,
    resetUserGrids: mockResetUserGridActionCreator,
  };
});



// ----------------------------
// 🔹 Test Store Setup
// ----------------------------
const defaultLoginState: LoginState = {
  userId: undefined,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  fieldErrors: undefined,
};

const defaultUserGridState: UserSaveGridsState = {
  userId: null,
  savedGrids: {},
};

const makeTestStore = (
  overrides?: Partial<{ login: LoginState; userSaveGrids: UserSaveGridsState }>
) =>
  configureStore({
    reducer: {
      login: loginReducer as Reducer<LoginState | undefined>,
      userSaveGrids: userSaveGridsReducer as Reducer<UserSaveGridsState | undefined>,
    },
    preloadedState: {
      login: { ...defaultLoginState, ...overrides?.login },
      userSaveGrids: { ...defaultUserGridState, ...overrides?.userSaveGrids },
    },
  });

// ----------------------------
// 🔹 Tests
// ----------------------------
describe('useAuthInit', () => {
  const Wrapper = ({ children, store }: { children: React.ReactNode; store: ReturnType<typeof makeTestStore> }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize cookies, request user data, and dispatch login on success', async () => {
    const store = makeTestStore({ login: { 
      userId: undefined,
      isLoggedIn: false,    
      isLoading: true,
      error: null,
      fieldErrors: undefined, 
    } });

    mockInitializeCookies.mockResolvedValue(undefined);
    mockRequestMe.mockResolvedValue({ success: true, userId: userLoggedAdmin });

    renderHook(() => useAuthInit(), { 
      wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>
    });

    await waitFor(() => {
      expect(mockInitializeCookies).toHaveBeenCalled();
      expect(mockRequestMe).toHaveBeenCalled();
      expect(mockLoginActionCreator).toHaveBeenCalledWith(userLoggedAdmin);
      expect(mockLogRecoverableError).not.toHaveBeenCalled();
    });
  });

  it('should dispatch logout, resetUserGrid and log error if initializeCookies fails', async () => {
    const store = makeTestStore({ login: { isLoggedIn: false, userId: 42, isLoading: false, error: null, fieldErrors: undefined } });

    const mockError = new Error('Failed to initialize cookies');
    mockInitializeCookies.mockRejectedValue(mockError);

    renderHook(() => useAuthInit(), { wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper> });

    await waitFor(() => {
      expect(mockInitializeCookies).toHaveBeenCalled();
      expect(mockRequestMe).not.toHaveBeenCalled();
      expect(mockLogoutActionCreator).toHaveBeenCalled();
      expect(mockResetUserGridActionCreator).toHaveBeenCalledWith(42);
      expect(mockLogRecoverableError).toHaveBeenCalled();
    });
  });

  it('should dispatch logout, resetUserGrid and log error if requestMe fails', async () => {
    const store = makeTestStore({ login: { isLoggedIn: false, userId: 42, isLoading: false, error: null, fieldErrors: undefined } });

    mockInitializeCookies.mockResolvedValue(undefined);
    mockRequestMe.mockRejectedValue(new Error('Unauthorized'));

    renderHook(() => useAuthInit(), { wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper> });

    await waitFor(() => {
      expect(mockInitializeCookies).toHaveBeenCalled();
      expect(mockRequestMe).toHaveBeenCalled();
      expect(mockLogoutActionCreator).toHaveBeenCalled();
      expect(mockResetUserGridActionCreator).toHaveBeenCalledWith(42);
      expect(mockLogRecoverableError).toHaveBeenCalled();
    });
  });

  it('should not perform API calls if already logged in', async () => {
    const store = makeTestStore({ login: { isLoggedIn: true, userId: userLoggedAdmin, isLoading: false, error: null, fieldErrors: undefined } });

    renderHook(() => useAuthInit(), { wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper> });

    await waitFor(() => {
      expect(mockInitializeCookies).not.toHaveBeenCalled();
      expect(mockRequestMe).not.toHaveBeenCalled();
      expect(mockLogoutActionCreator).not.toHaveBeenCalled();
      expect(mockResetUserGridActionCreator).not.toHaveBeenCalled();
    });
  });
});
