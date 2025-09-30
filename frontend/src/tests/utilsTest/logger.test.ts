import { store } from '@/store';
import { logRequestState } from '@/utils/logger';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockLoginStateAdmin } from '../mocks/redux';

describe('logRecoverableError', () => {
    const originalEnv = import.meta.env;

    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        // @ts-expect-error: import.meta.env wird für Tests überschrieben
        import.meta.env = { ...originalEnv };
    });

    afterEach(() => {
        // @ts-expect-error: import.meta.env wird für Tests überschrieben
        import.meta.env = originalEnv;
    });

    it('logs to console.warn in development mode', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = new Error('Test error');

        const { logRecoverableError } = await import('@/utils/logger');
        logRecoverableError({
            context: 'TestContext',
            error,
            extra: { info: 'Extra info' },
            mode: 'development',
        });

        expect(warnSpy).toHaveBeenCalled();
    });

    it('does not log anything in test mode', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = new Error('Should not log');

        const { logRecoverableError } = await import('@/utils/logger');
        logRecoverableError({
            context: 'TestContext',
            error,
            mode: 'test',
        });

        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('calls fetch in production mode', async () => {
        const fetchMock = vi.fn(() => Promise.resolve({ ok: true })) as unknown;
        // @ts-expect-error only needed for local testing
        global.fetch = fetchMock;

        const { logRecoverableError } = await import('@/utils/logger');
        logRecoverableError({
            context: 'ProdContext',
            error: new Error('Prod error'),
            mode: 'production',
        });

        expect(fetchMock).toHaveBeenCalledWith('/api/log-client-error', expect.any(Object));
    });

    it('logs fetch errors to console.error in production', async () => {
        const fetchMock = vi.fn(() => Promise.reject(new Error('Fetch failed')));
        global.fetch = fetchMock;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { logRecoverableError } = await import('@/utils/logger');
        logRecoverableError({
            context: 'ProdContext',
            error: new Error('Some error'),
            mode: 'production',
        });

        // Kleines Delay, damit das Promise catch ausgeführt wird
        await new Promise((r) => setTimeout(r, 0));

        expect(errorSpy).toHaveBeenCalledWith('[Logging failed]', expect.any(Error));
    });
});

describe('logReduxState', () => {
    const originalEnv = import.meta.env;

    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        // @ts-expect-error – import.meta.env is readonly
        import.meta.env = { ...originalEnv };
    });

    afterEach(() => {
        // @ts-expect-error - cleanup
        import.meta.env = originalEnv;
    });

    it('should log to console.log in development mode', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const { logReduxState } = await import('@/utils/logger');
        const state = store.getState();

        logReduxState('login', state.login, 'development');
        logReduxState('userGrid', state.userGrid, 'development');

        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith('[Redux login] updated:', state.login);
        expect(logSpy).toHaveBeenCalledWith('[Redux userGrid] updated:', state.userGrid);
    });

    it('should not log in test mode', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
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
        // @ts-expect-error – import.meta.env is readonly
        import.meta.env = { ...originalEnv };
    });

    afterEach(() => {
        // @ts-expect-error -only for local testing
        import.meta.env = originalEnv;
    });

    it('should log to console.log in development mode', () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const initCookiesError = { error: true, axiosStatus: false };
        const result = { success: true, message: 'authenticated.' };
        const error = { success: false, message: 'authentication denied.' };

        // selectLoginState → Übergabe so, wie die Funktion es erwartet (responseType = mockLoginStateAdmin)
        logRequestState('selectLoginState', mockLoginStateAdmin, 'development');
        // initializeCookies → kein responseType
        logRequestState('initializeCookies', undefined, 'development');
        // initializeCookiesError
        logRequestState('initializeCookiesError', initCookiesError, 'development');
        // requestMe
        logRequestState('requestMe', result, 'development');
        // requestMeError
        logRequestState('requestMeError', error, 'development');

        expect(logSpy).toHaveBeenCalledTimes(5);

        // selectLoginState
        expect(logSpy).toHaveBeenCalledWith(
            '[useAuthInit] Guard active → already logged in (userId:',
            mockLoginStateAdmin,
            ')',
        );
        // initializeCookies
        expect(logSpy).toHaveBeenCalledWith('[useAuthInit] Cookies initialized and throttled');
        // initializeCookiesError
        expect(logSpy).toHaveBeenCalledWith(
            '[useAuthInit] Cookie init failed → logout',
            initCookiesError,
        );
        // requestMe
        expect(logSpy).toHaveBeenCalledWith('[useAuthInit] requestMe() result:', result);
        // requestMeError
        expect(logSpy).toHaveBeenCalledWith(
            '[useAuthInit] requestMe() failed → logging out',
            error,
        );

        logSpy.mockRestore();
    });

    it('should not log in test mode', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const { logRequestState } = await import('@/utils/logger');
        const result = {
            success: true,
            message: 'authenticated.',
        };

        logRequestState('requestMe', result, 'test');

        expect(logSpy).not.toHaveBeenCalled();
    });
});
