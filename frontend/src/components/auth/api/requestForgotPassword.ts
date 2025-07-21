import LaravelApiClient from '@/plugins/axios';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface RequestPasswordResetResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
}

const requestForgotPassword = async (email: string): Promise<RequestPasswordResetResult> => {
    try {
        await initializeCookies();
        const response = await LaravelApiClient.post('/auth/spa/forgot-password', { email });
        return setResponseValidationSuccess(
            response.data.message || 'Passwort-Reset-Link wurde gesendet!',
        );
    } catch (error: any) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default requestForgotPassword;
