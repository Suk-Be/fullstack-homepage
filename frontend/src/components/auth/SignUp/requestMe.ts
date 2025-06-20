import LaravelApiClient from '../../../plugins/axios';
import { User } from '../../../types/user';
import { isAxiosError, translateHttpError } from '../../../utils/auth/translateHttpError';

/*
 * This function logs the user data and is used right after submitting user data on the register api.
 * It presumes that the xsrf cookie is already set.
 * If the request is successful, it logs the user data to the console.
 * If there is an error, it logs the error details to the console.
 *
 * @param {boolean} shouldFetchUser - true to fetch user data and logging them to console.
 */

const requestMe = async (shouldFetchUser = false) => {
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
};

export default requestMe;
