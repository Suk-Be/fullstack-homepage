import axios from 'axios';
import { serverBaseUrl } from '../utils/apiBaseUrl';

let isCsrfFetched = false;

function resetIsCsrfFetchedAndResetCookies() {
    isCsrfFetched = false;

    document.cookie = 'XSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'laravel_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function setCookie() {
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
    resetIsCsrfFetchedAndResetCookies();
    await setCookie();
}

export default initializeCookies;
export { resetIsCsrfFetchedAndResetCookies, setCookie };
