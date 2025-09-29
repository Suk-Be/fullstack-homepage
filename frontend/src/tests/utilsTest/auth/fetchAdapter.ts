import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeHeaders(headers: any): Record<string, string> {
    if (!headers) return {};

    // AxiosHeaders hat .toJSON() oder .raw() Methode, je nach Version
    if (typeof headers.toJSON === 'function') {
        return headers.toJSON();
    }

    // Wenn es ein plain Objekt ist, casten wir einfach string values
    const result: Record<string, string> = {};
    for (const key in headers) {
        const val = headers[key];
        if (typeof val === 'string') {
            result[key] = val;
        } else if (val != null) {
            result[key] = String(val);
        }
    }
    return result;
}

/**
 * Ein Axios-Adapter, der `fetch` statt `axios` intern verwendet.
 *
 * Nützlich als Testing-Utility, um Requests zu simulieren, die mit axios, msw und Redux Thunks aufgerufen werden.
 * In dieser Konstellation kann MSW (Mock Service Worker) Handler Axios-Requests nicht richtig intercepten.
 *
 * @param {AxiosRequestConfig} config - Die Axios-Konfigurationsobjekt für den Request.
 * @returns {Promise<AxiosResponse>} Ein Promise, das ein AxiosResponse-ähnliches Objekt mit den Fetch-Ergebnissen zurückgibt.
 *
 * @example SignIn
 * import fetchAdapter from '@/tests/utilsTest/auth/fetchAdapter';
 *
 * ApiClient.defaults.adapter = fetchAdapter;
 *
 * describe('SignIn component', () => {
 *  beforeEach(() => {
 *    db.user.create(registeredUserData);
 *        const toggleAuth = vi.fn(() => false);
 *        renderWithProviders(<SignIn onToggleAuth={toggleAuth} />);
 * });
 */

export default async function fetchAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const { url, method = 'get', headers, data, timeout } = config;

    const controller = new AbortController();
    if (timeout) {
        setTimeout(() => controller.abort(), timeout);
    }

    const response = await fetch(url!, {
        method: method.toUpperCase(),
        headers: normalizeHeaders(headers),
        body: data,
        signal: controller.signal,
        credentials: config.withCredentials ? 'include' : 'same-origin',
    });

    const responseData = await response.json().catch(() => null);

    return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: {}, // Optional: Parse headers falls nötig
        config: config as InternalAxiosRequestConfig,
        request: {},
    };
}
