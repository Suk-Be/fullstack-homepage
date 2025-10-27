import requestMe from '@/components/auth/requests/requestMe';
import { BaseClient } from '@/plugins/axios';
import { User } from '@/types/Redux';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';

interface LoginResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    user?: User;
    userId?: number;
}

const requestLogin = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<LoginResult> => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.auth.login);

        await initializeCookies();

        const response = await BaseClient.post('/login', {
            email,
            password,
            recaptcha_token: recaptchaToken,
        });

        let userId: number | undefined = undefined;
        const meResult = await requestMe();
        if (meResult?.success && meResult.userId !== undefined) {
            userId = meResult.userId;
        }

        return {
            ...setResponseValidationSuccess(response.data.message || 'Login erfolgreich!'),
            userId,
        };
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);

        return setResponseValidationError(error);
    }
};

export default requestLogin;
