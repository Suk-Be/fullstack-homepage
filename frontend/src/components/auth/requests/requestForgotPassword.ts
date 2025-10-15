import { BaseClient } from '@/plugins/axios';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';

interface RequestPasswordResetResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

const requestForgotPassword = async (email: string): Promise<RequestPasswordResetResult> => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.auth.forgotPassword);

        await initializeCookies();

        const response = await BaseClient.post('/forgot-password', {
            email,
            recaptcha_token: recaptchaToken,
        });

        return setResponseValidationSuccess(
            response.data.message || 'Passwort-Reset-Link wurde gesendet!',
        );
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default requestForgotPassword;
