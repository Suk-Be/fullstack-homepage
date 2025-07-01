import axios from 'axios';
import { serverBaseUrl } from '../utils/apiBaseUrl';

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
    } catch (err) {
        console.error('Failed to fetch CSRF cookie', err);
    }
}

async function initializeCookies() {
    let lastInitializedAt = 0;
    const THROTTLE_DELAY_MS = 5000; // 5 seconds

    const now = Date.now();

    if (now - lastInitializedAt > THROTTLE_DELAY_MS) {
        resetIsCsrfFetchedAndResetCookies();
        await setCookies();
    } else {
        console.log('[Throttle] Skipping cookie initialization due to throttling.');
    }
}

export default initializeCookies;
export { resetIsCsrfFetchedAndResetCookies, setCookies };
