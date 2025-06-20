// export default registerUser;
import Cookies from 'js-cookie';
import apiBaseUrl from '../../../utils/apiBaseUrl';
import headers, { registerHeaders } from '../../../utils/auth/requestHeaders';
import { translateHttpError } from '../../../utils/auth/translateHttpError';
import requestMe from './requestMe';

interface RegisterUserParams {
    shouldFetchUser: boolean;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const getCsrfToken = async (): Promise<string> => {
    await fetch(`${apiBaseUrl}/csrf-cookie`, {
        headers,
        credentials: 'include',
    });

    const token = Cookies.get('XSRF-TOKEN');
    if (!token) throw new Error('CSRF token not found');

    return token;
};

const handleErrorResponse = async (response: Response) => {
    const errorData = await response.json();
    const { status } = response;

    const defaultMessages: Record<number, string> = {
        422: 'User already exists',
        401: 'Nicht autorisiert – ggf. ausgeloggt',
        419: 'CSRF-Token abgelaufen',
    };

    return {
        success: false,
        message: errorData.message || defaultMessages[status] || 'Ein Fehler ist aufgetreten',
        errors: errorData.errors || {},
    };
};

const requestRegister = async ({
    shouldFetchUser = false,
    name,
    email,
    password,
    password_confirmation,
}: RegisterUserParams) => {
    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch(`${apiBaseUrl}/auth/spa/register`, {
            method: 'POST',
            credentials: 'include',
            headers: registerHeaders(csrfToken),
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
            }),
        });

        if (!response.ok) return await handleErrorResponse(response);

        await requestMe(shouldFetchUser);

        return { success: true };
    } catch (error: any) {
        const response = error.response;

        if (response?.status === 422) {
            return {
                success: false,
                message: response.data.message || 'Validierungsfehler',
                errors: response.data.errors || {},
            };
        }

        return {
            success: false,
            message: translateHttpError(error),
            errors: {
                email: ['Diese E-Mail ist nicht registriert oder das Passwort ist falsch.'],
            },
        };
    }
};

export default requestRegister;
