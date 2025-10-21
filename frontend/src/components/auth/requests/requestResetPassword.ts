import { BaseClient } from '@/plugins/axios';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';

interface ResetPasswordResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

const resetPassword = async (
    email: string,
    password: string,
    password_confirmation: string,
    token: string,
): Promise<ResetPasswordResult> => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.auth.resetPassword);
        await initializeCookies();
        const response = await BaseClient.post('/reset-password', {
            email,
            password,
            password_confirmation,
            token,
            recaptcha_token: recaptchaToken,
        });
        console.log('response.data: ', response);
        return setResponseValidationSuccess(
            response.data.message || 'Passwort wurde erfolgreich zurückgesetzt!',
        );
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default resetPassword;
