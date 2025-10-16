import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

describe('getRecaptchaToken', () => {
    let originalEnv: ImportMetaEnv;
    let appendChildSpy: MockInstance<(this: unknown, ...args: unknown[]) => unknown>;

    beforeEach(() => {
        originalEnv = import.meta.env;

        // @ts-ignore: Mocking appendChild for test
        appendChildSpy = vi.spyOn(Node.prototype, 'appendChild').mockImplementation(function (
            this: unknown,
            ...args: unknown[]
        ): unknown {
            const node = args[0] as HTMLScriptElement;
            node.onload?.(new Event('load'));
            return node;
        });

        // Reset global grecaptcha
        delete (globalThis as unknown as { grecaptcha?: unknown })['grecaptcha'];
    });

    afterEach(() => {
        appendChildSpy.mockRestore();
        (import.meta as { env: ImportMetaEnv }).env = originalEnv;
        vi.restoreAllMocks();
    });

    it('calls grecaptcha.execute with correct parameters', async () => {
        interface Grecaptcha {
            execute: (key: string, options: { action: string }) => Promise<string>;
            ready: (cb: () => void) => void;
        }

        const executeMock: Grecaptcha['execute'] = vi.fn().mockResolvedValue('mocked-token');
        const readyMock: Grecaptcha['ready'] = (cb) => cb();

        (globalThis as unknown as { grecaptcha: Grecaptcha }).grecaptcha = {
            execute: executeMock,
            ready: readyMock,
        };

        const token = await getRecaptchaToken('login');

        expect(token).toBe('mocked-token');
        expect(executeMock).toHaveBeenCalledWith(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: 'login',
        });
    });

    it('throws an error if SITE_KEY is missing', async () => {
        (import.meta as { env: Partial<ImportMetaEnv> }).env = {
            ...import.meta.env,
            VITE_RECAPTCHA_SITE_KEY: '',
        };

        await expect(getRecaptchaToken('login')).rejects.toThrow('grecaptcha ist nicht verfügbar.');
    });

    it('throws an error if grecaptcha is unavailable', async () => {
        await expect(getRecaptchaToken('login')).rejects.toThrow('grecaptcha ist nicht verfügbar.');
    });

    it('throws an error if grecaptcha.execute rejects', async () => {
        interface Grecaptcha {
            execute: (key: string, options: { action: string }) => Promise<string>;
            ready: (cb: () => void) => void;
        }

        const executeMock: Grecaptcha['execute'] = vi.fn().mockRejectedValue('Execution failed');
        const readyMock: Grecaptcha['ready'] = (cb) => cb();

        (globalThis as unknown as { grecaptcha: Grecaptcha }).grecaptcha = {
            execute: executeMock,
            ready: readyMock,
        };

        await expect(getRecaptchaToken('login')).rejects.toBe('Execution failed');
    });
});
