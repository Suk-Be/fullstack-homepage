import axios from 'axios';
import { serverBaseUrl } from '../utils/apiBaseUrl';

let csrfFetched = false;

// Call initialize on app startup or before first protected request
// it is called in App.tsx
async function initializeCookie() {
    if (csrfFetched) return; // skip if already fetched
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
