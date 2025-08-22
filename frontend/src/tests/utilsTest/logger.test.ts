import { store } from '@/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('logRecoverableError', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    // @ts-ignore – import.meta.env is readonly
    import.meta.env = { ...originalEnv };
  });

  afterEach(() => {
    // @ts-ignore
    import.meta.env = originalEnv;
  });

  it('should log to console.warn in non-production mode', async () => {
    // @ts-ignore
    import.meta.env.MODE = 'development';

    // @ts-ignore
    process.env.NODE_ENV = 'development';

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('Test error');

    const { logRecoverableError } = await import('@/utils/logger');

    logRecoverableError({
      context: 'TestContext',
      error,
      extra: { info: 'Extra info' },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      '[DEV LOG] TestContext',
      error,
      { info: 'Extra info' },
    );
  });

});

describe('logReduxState', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    // @ts-ignore – import.meta.env is readonly
    import.meta.env = { ...originalEnv };
  });

  afterEach(() => {
    // @ts-ignore
    import.meta.env = originalEnv;
  });

   it('should log to console.log in development mode', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { logReduxState } = await import('@/utils/logger');
    const state = store.getState();

    logReduxState('login', state.login, 'development');
    logReduxState('userGrid', state.userGrid, 'development');

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith('🔹 login slice updated:', state.login);
    expect(logSpy).toHaveBeenCalledWith('🔹 userGrid slice updated:', state.userGrid);
  });

  it('should not log in test mode', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { logReduxState } = await import('@/utils/logger');
    const state = store.getState();

    logReduxState('login', state.login, 'test');

    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe('logRequestState', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    // @ts-ignore – import.meta.env is readonly
    import.meta.env = { ...originalEnv };
  });

  afterEach(() => {
    // @ts-ignore
    import.meta.env = originalEnv;
  });

  it('should log to console.log in development mode', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { logRequestState } = await import('@/utils/logger');
    const userId = 123
    const initCookiesError = {
      error: true,
      axiosStatus: false
    }
    const result = {
      "success": true,
      "message": "authenticated."
    }
    const error = {
      "success": false,
      "message": "authentication denied."
    }

    logRequestState('selectLoginState', userId, 'development');
    logRequestState('initializeCookies', undefined, 'development'); // 'initializeCookies' does not have a responseType, so pass undefined as the second argument
    logRequestState('initializeCookiesError', initCookiesError, 'development');
    logRequestState('requestMe', result, 'development');
    logRequestState('requestMeError', error, 'development');

    expect(logSpy).toHaveBeenCalledTimes(5);
    // selectLoginState
    expect(logSpy).toHaveBeenCalledWith('[useAuthInit] Guard active → already logged in (userId:', userId, ')');
    // initializeCookies
    expect(logSpy).toHaveBeenCalledWith('[useAuthInit] Cookies initialized and throttled');
    // initializeCookiesError
    expect(logSpy).toHaveBeenCalledWith('[useAuthInit] Cookie init failed → logout', initCookiesError);
    // requestMe
    expect(logSpy).toHaveBeenCalledWith('[useAuthInit] requestMe() result:', result);
    // requestMeError
    expect(logSpy).toHaveBeenCalledWith('[useAuthInit] requestMe() failed → logging out', error);

    logSpy.mockRestore(); // It is good practice to restore the mock after the test
  });

  it('should not log in test mode', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { logRequestState } = await import('@/utils/logger');
    const result = {
      "success": true,
      "message": "authenticated."
    }

    logRequestState('requestMe', result, 'test')

    expect(logSpy).not.toHaveBeenCalled();
  });
});

