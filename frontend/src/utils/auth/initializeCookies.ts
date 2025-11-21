import { BaseClient } from '@/plugins/axios';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import Cookies from 'js-cookie';

let lastInitializedAt = 0;
let isCsrfFetched = false;

// For testing only: resets internal state
export function __testOnlyReset() {
    lastInitializedAt = 0;
    isCsrfFetched = false;
}

export function resetCookies() {
    isCsrfFetched = false;

    Cookies.remove('XSRF-TOKEN', { path: '/' });
    Cookies.remove('laravel_session', { path: '/' });
}

/**
 * Fetch CSRF cookies for clients
 */
async function fetchCsrf() {
    if (isCsrfFetched) return;

    isCsrfFetched = true;

    try {
        // Fetch CSRF for WebClient (used for auth forms)
        await BaseClient.get('/api/sanctum/csrf-cookie', { withCredentials: true });
    } catch (error) {
        const axiosStatus = getAxiosStatus(error);
        logRecoverableError({
            context: 'Failed to fetch CSRF cookie',
            error,
            extra: { axiosStatus },
        });
    }
}

/**
 * Initialize CSRF cookies with throttling
 */
async function initializeCookies() {
    const THROTTLE_DELAY_MS = 5000; // 5 seconds
    const now = Date.now();

    if (now - lastInitializedAt > THROTTLE_DELAY_MS) {
        lastInitializedAt = now;
        resetCookies();
        await fetchCsrf();
    }
}

export default initializeCookies;
export { fetchCsrf };
