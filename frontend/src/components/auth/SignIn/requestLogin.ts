import LaravelApiClient from '../../../plugins/axios';
import {
    ApiErrorData,
    isAxiosError,
    translateHttpError,
} from '../../../utils/auth/translateHttpError';

interface User {
    id: number;
    name: string;
    email: string;
}

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

        // Getting user data right after login
        if (shouldFetchUser) {
            try {
                const { data: user } = await LaravelApiClient.get<User>('/me');
                console.log('Erfolgreich angemeldet mit: ', user);
                return { success: true, user };
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    console.error(
                        'Fehler beim Zugriff auf Benutzerdaten nach erfolgreicher Anmeldung:',
                        error,
                    );

                    // @ts-ignore
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        return {
                            success: false,
                            message: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.',
                            errors: {
                                general: ['Sitzung abgelaufen. Bitte melden Sie sich erneut an.'],
                            },
                        };
                    } else {
                        // For other /me errors, use the general translated message
                        return {
                            success: false,
                            message: translateHttpError(error),
                            errors: { general: [translateHttpError(error)] },
                        };
                    }
                } else {
                    console.error(
                        'Ein unerwarteter, nicht-Axios Fehler beim Laden des Benutzerprofils:',
                        error,
                    );
                    return {
                        success: false,
                        message: 'Ein unerwarteter Fehler ist aufgetreten.',
                        errors: { general: ['Ein unerwarteter Fehler ist aufgetreten.'] },
                    };
                }
            }
        }

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
