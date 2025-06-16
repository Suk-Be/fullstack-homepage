import apiBaseUrl from '../../apiBaseUrl';
import { registerHeaders } from '../requestHeaders';

/*
 * This function logs the user data and is used right after submitting user data on the register api.
 * It presumes that the xsrf cookie is already set.
 * If the request is successful, it logs the user data to the console.
 * If there is an error, it logs the error details to the console.
 *
 * @param {boolean} islogRegisteredUser - Indicates if the user is registered and should be logged in.
 * @param {string} csrfToken - The CSRF token for secure requests.
 */

const logUserAfterRegistration = async (islog: boolean, csrfToken: string) => {
    if (islog) {
        try {
            const response = await fetch(`${apiBaseUrl}/me`, {
                method: 'GET',
                credentials: 'include',
                headers: registerHeaders(csrfToken),
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log('get User data, successful login', json);
        } catch (error) {
            if (error instanceof Error) {
                console.error('error', error);
                console.error('errorMessage', error.message);
                console.error('Status:', error.stack);
            } else {
                console.error(error);
            }
        }
    }
};

export default logUserAfterRegistration;
