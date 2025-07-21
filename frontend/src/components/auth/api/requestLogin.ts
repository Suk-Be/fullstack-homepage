import requestMe from '@/components/auth/api/requestMe';
import LaravelApiClient from '@/plugins/axios';
import { User } from '@/types/User';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface LoginResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
    user?: User;
}

const requestLogin = async ({
    shouldFetchUser = false,
    email,
    password,
}: {
    shouldFetchUser: boolean;
    email: string;
    password: string;
}): Promise<LoginResult> => {
    try {
        await initializeCookies();
        const response = await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        await requestMe(shouldFetchUser);

        return setResponseValidationSuccess(response.data.message || 'Login erfogreich!');
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);

        return setResponseValidationError(error);
    }
};

export default requestLogin;
