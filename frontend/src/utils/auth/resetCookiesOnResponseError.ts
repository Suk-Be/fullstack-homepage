import { isAxiosError } from 'axios';
import initializeCookies from '../../plugins/initializeCookie';

/**
 * Checks if the given error is an Axios error with a 419 (CSRF token mismatch)
 * or 422 (validation error) status code and, if so, resets and reinitializes
 * the CSRF and session cookies to recover from stale or invalid states.
 *
 * @param {unknown} error - The error object from a failed Axios request.
 * @returns {Promise<void>} A promise that resolves after handling the cookie reset if needed.
 */

const resetCookiesOnResponseError = async (error: unknown): Promise<void> => {
    const axiosStatus = isAxiosError(error) ? error.response?.status : null;

    if (axiosStatus === 419 || axiosStatus === 422) {
        // reset cookies and re-fetch cookies
        await initializeCookies();
    }
};

export default resetCookiesOnResponseError;
