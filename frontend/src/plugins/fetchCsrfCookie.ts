import axios from 'axios';
import { serverBaseUrl } from '../utils/apiBaseUrl';

let csrfFetched = false;

export function resetCsrfFetched() {
    csrfFetched = false;
}

async function initializeCookie() {
    if (csrfFetched) return; 
    csrfFetched = true;

    try {
        await axios.get(`${serverBaseUrl()}/api/csrf-cookie`, {
            // next line sets the xsrf cookie
            withCredentials: true,
        });
    } catch (err) {
        console.error('Failed to fetch CSRF cookie', err);
    }
}

export default initializeCookie;
