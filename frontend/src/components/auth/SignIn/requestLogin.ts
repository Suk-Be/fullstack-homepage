import LaravelApiClient from '../../../plugins/axios';
import { User } from '../../../types/User';
import {
    ApiErrorData,
    isAxiosError,
    translateHttpError,
} from '../../../utils/auth/translateHttpError';
import requestMe from '../SignUp/requestMe';

interface LoginResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
    user?: User;
}

const requestLogin = async ({
    shouldFetchUser = false,
    email,
    password,
}: {
    shouldFetchUser: boolean;
    email: string;
    password: string;
}): Promise<LoginResult> => {
    try {
        // CSRF token is automatically handled by the axios interceptor
        await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        /**
         * Getting user data and logging user data to console
         * will not not return anything unless called with true
         *
         * example: requestMe(true)
         */
        await requestMe(shouldFetchUser);

        return { success: true };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            // @ts-ignore
            const response = error.response;
            const translatedMessage = translateHttpError(error); // Get message once

            // 422 backend validation errors on the form
            if (response?.status === 422) {
                const errorData = response.data as ApiErrorData;
                return {
                    success: false,
                    message: translatedMessage, // Will be "Validierungsfehler." or specific Laravel message
                    errors: errorData.errors || ({} as { [key: string]: string[] }),
                };
            }

            // 401 (wrong credentials)
            if (response?.status === 401) {
                return {
                    success: false,
                    message: translatedMessage, // e.g., "Nicht autorisiert" or "E-Mail oder Passwort ist falsch"
                    errors: {
                        email: [translatedMessage], // Put it on the email field
                    },
                };
            }

            // any other Axios errors (404, 500, network, etc.)
            return {
                success: false,
                message: translatedMessage,
                errors: { general: [translatedMessage] },
            };
        } else {
            console.error('Ein unerwarteter, nicht-Axios Fehler während der Anmeldung:', error);
            const genericErrorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';
            return {
                success: false,
                message: genericErrorMessage,
                errors: { general: [genericErrorMessage] },
            };
        }
    }
};

export default requestLogin;
