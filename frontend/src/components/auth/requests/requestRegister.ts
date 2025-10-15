import requestMe from '@/components/auth/requests/requestMe';
import { BaseClient } from '@/plugins/axios';
import { LoginErrorResponse, LoginSuccessResponse, RegisterFormData } from '@/types/entities';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';

interface RegisterUserParams {
    form: RegisterFormData;
    userId?: number;
}

const requestRegister = async ({
    form,
}: RegisterUserParams): Promise<LoginSuccessResponse | LoginErrorResponse> => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.auth.register);
        await initializeCookies();

        const formDataPost = await BaseClient.post('/register', {
            ...form,
            recaptcha_token: recaptchaToken,
        });

        let userId: number | undefined = undefined;
        let role: 'admin' | 'user' | undefined = undefined;

        const meResult = await requestMe();
        if (meResult?.success && meResult.userId !== undefined && meResult.role !== undefined) {
            userId = meResult.userId;
            role = meResult.role;
        }

        return {
            ...setResponseValidationSuccess(
                formDataPost.data.message || 'Die Registrierung hat geklappt!',
            ),
            userId,
            role,
        } as LoginErrorResponse;
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default requestRegister;
