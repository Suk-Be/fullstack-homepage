import type { AxiosRequestConfig, AxiosResponse } from 'axios';

vi.mock('@/plugins/axios', () => {
    return {
        default: { get: vi.fn() }, // ApiClient
        BaseClient: { get: vi.fn() }, // BaseClient
    };
});

type AxiosGet = (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<unknown>>;

import ApiClient, { BaseClient } from '@/plugins/axios';
import { mockResponse } from '@/tests/mocks/api';
import { __testOnlyReset, fetchCsrf, resetCookies } from '@/utils/auth/initializeCookies';
import { Mock, vi } from 'vitest';

vi.mock('@/utils/logger', () => ({
    getAxiosStatus: vi.fn(() => 'MOCK_STATUS'),
    logRecoverableError: vi.fn(),
}));

const cookieStore: Record<string, string> = {};

Object.defineProperty(document, 'cookie', {
    get() {
        return Object.entries(cookieStore)
            .map(([key, val]) => `${key}=${val}`)
            .join('; ');
    },
    set(cookie: string) {
        const [pair, ...attrs] = cookie.split(';').map((s) => s.trim());
        const [key, val] = pair.split('=');

        // If expires in past, delete cookie
        const expiresAttr = attrs.find((attr) => attr.toLowerCase().startsWith('expires='));
        if (expiresAttr) {
            const expiresDate = new Date(expiresAttr.split('=')[1]);
            if (expiresDate < new Date()) {
                delete cookieStore[key];
                return;
            }
        }
        cookieStore[key] = val;
    },
});

describe('resetCookies', () => {
    it('should clear CSRF-related cookies', () => {
        document.cookie = 'XSRF-TOKEN=abc123';
        document.cookie = 'laravel_session=xyz456';

        expect(document.cookie).toContain('XSRF-TOKEN=abc123');
        expect(document.cookie).toContain('laravel_session=xyz456');

        resetCookies();

        expect(document.cookie.includes('XSRF-TOKEN=')).toBe(false);
        expect(document.cookie.includes('laravel_session=')).toBe(false);
    });
});

describe('fetchCsrf', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        __testOnlyReset();
    });

    it('should call both endpoints once and set isCsrfFetched', async () => {
        (
            BaseClient.get as Mock<(...args: unknown[]) => Promise<AxiosResponse<unknown>>>
        ).mockResolvedValueOnce(mockResponse);
        (
            ApiClient.get as Mock<(...args: unknown[]) => Promise<AxiosResponse<unknown>>>
        ).mockResolvedValueOnce(mockResponse);

        await fetchCsrf();

        expect(BaseClient.get as Mock<AxiosGet>).toHaveBeenCalledWith('/api/csrf-cookie', {
            withCredentials: true,
        });
        expect(ApiClient.get as Mock<AxiosGet>).toHaveBeenCalledWith('/csrf-cookie', {
            withCredentials: true,
        });

        // second call should not trigger again
        await fetchCsrf();

        expect(BaseClient.get as Mock<AxiosGet>).toHaveBeenCalledTimes(1);
        expect(ApiClient.get as Mock<AxiosGet>).toHaveBeenCalledTimes(1);
    });

    it('should log error if call fails', async () => {
        const { logRecoverableError } = await import('@/utils/logger');
        (
            BaseClient.get as Mock<(...args: unknown[]) => Promise<AxiosResponse<unknown>>>
        ).mockRejectedValueOnce(new Error('network'));
        (
            ApiClient.get as Mock<(...args: unknown[]) => Promise<AxiosResponse<unknown>>>
        ).mockResolvedValueOnce(mockResponse);

        await fetchCsrf();

        expect(logRecoverableError).toHaveBeenCalledWith(
            expect.objectContaining({
                context: 'Failed to fetch CSRF cookie',
            }),
        );
    });
});
