// export default registerUser;
import Cookies from 'js-cookie';
import apiBaseUrl from '../apiBaseUrl';
import logUserAfterRegistration from './logUserAfterRegistration';
import headers, { registerHeaders } from './requestHeaders';

const registerUser = async ({
    islog,
    name,
    email,
    password,
    password_confirmation,
}: {
    islog: boolean;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    let csrfToken: string | undefined;

    try {
        // Step 1: Get CSRF cookie
        await fetch(`${apiBaseUrl}/csrf-cookie`, {
            headers: headers,
            credentials: 'include',
        }).then(() => {
            csrfToken = Cookies.get('XSRF-TOKEN');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
        });

        // Step 2: Send register request
        if (csrfToken) {
            const response = await fetch(`${apiBaseUrl}/auth/spa/register`, {
                method: 'POST',
                credentials: 'include',
                headers: registerHeaders(csrfToken),
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                }),
            });

            // Step 3: Return validation based on response status
            if (response.status === 422) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'User already exists' };
            }
            if (response.status === 401) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Nicht autorisiert – ggf. ausgeloggt',
                };
            }
            if (response.status === 419) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'CSRF-Token abgelaufen' };
            }

            // Step 4: if isLog is set to true: the registered user data is fetched from backend
            await logUserAfterRegistration(islog, csrfToken);
        }
        // If everything is successful, return success which makes possible errors on email validation for already existing emails disappear
        return { success: true };
    } catch (error: any) {
        console.log('Status:', error);

        console.log('Status:', error);

        return { success: false, message: error };
    }
};

export default registerUser;
