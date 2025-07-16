import LaravelApiClient from '@/plugins/axios';
import initializeCookies from '@/plugins/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface ResetPasswordResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
}

const resetPassword = async (
    email: string,
    password: string,
    password_confirmation: string,
    token: string,
): Promise<ResetPasswordResult> => {
    try {
        await initializeCookies();
        const response = await LaravelApiClient.post('/auth/spa/reset-password', {
            email,
            password,
            password_confirmation,
            token,
        });
        return setResponseValidationSuccess(
            response.data.message || 'Passwort wurde erfolgreich zurückgesetzt!',
        );
    } catch (error: any) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default resetPassword;
