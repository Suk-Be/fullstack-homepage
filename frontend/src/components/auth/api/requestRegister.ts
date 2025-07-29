import requestMe from '@/components/auth/api/requestMe';
import LaravelApiClient from '@/plugins/axios';
import { RegisterFormData, RegisterResponse } from '@/types/entities';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface RegisterUserParams {
    form: RegisterFormData;
    userId?: number;
}

const requestRegister = async ({ form }: RegisterUserParams): Promise<RegisterResponse> => {
    try {
        await initializeCookies();
        const response = await LaravelApiClient.post('/auth/spa/register', form);

        let userId: number | undefined = undefined;
        const meResult = await requestMe();
        if (meResult?.success && meResult.userId !== undefined) {
            userId = meResult.userId;
        }

        return {
            ...setResponseValidationSuccess(
                response.data.message || 'Die Registrierung hat geklappt!',
            ),
            userId,
        };
    } catch (error: any) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default requestRegister;
