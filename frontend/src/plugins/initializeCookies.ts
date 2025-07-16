import { serverBaseUrl } from '@/utils/apiBaseUrl';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import axios from 'axios';

let lastInitializedAt = 0;
let isCsrfFetched = false;

function resetIsCsrfFetchedAndResetCookies() {
    isCsrfFetched = false;

    document.cookie = 'XSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'laravel_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function setCookies() {
    if (isCsrfFetched) return;

    isCsrfFetched = true;

    try {
        await axios.get(`${serverBaseUrl()}/api/csrf-cookie`, {
            // next line sets the xsrf cookie
            withCredentials: true,
        });
    } catch (error) {
        const axiosStatus = getAxiosStatus(error);
        logRecoverableError({
            context: 'Failed to fetch CSRF cookie',
            error,
            extra: { axiosStatus },
        });
    }
}

async function initializeCookies() {
    const THROTTLE_DELAY_MS = 5000; // 5 seconds
    const now = Date.now();

    if (now - lastInitializedAt > THROTTLE_DELAY_MS) {
        lastInitializedAt = now;
        resetIsCsrfFetchedAndResetCookies();
        await setCookies();
    }
    if (import.meta.env.MODE === 'development') {
        console.log('[Throttle] Skipping cookie initialization due to throttling.');
    }
}

export default initializeCookies;
export { resetIsCsrfFetchedAndResetCookies, setCookies };
