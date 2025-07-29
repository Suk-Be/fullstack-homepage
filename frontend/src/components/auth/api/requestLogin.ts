import requestMe from '@/components/auth/api/requestMe';
import LaravelApiClient from '@/plugins/axios';
import { User } from '@/types/Redux';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface LoginResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
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
        await initializeCookies();
        const response = await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
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
