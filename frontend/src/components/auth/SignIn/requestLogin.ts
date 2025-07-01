import { isAxiosError } from 'axios';
import LaravelApiClient from '../../../plugins/axios';
import initializeCookies from '../../../plugins/initializeCookie';
import { User } from '../../../types/User';
import { setResponseValidationError } from '../../../utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '../../../utils/auth/setResponseValidationSuccess';
import requestMe from '../SignUp/requestMe';

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
        // await setCookie();
        const response = await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        await requestMe(shouldFetchUser);

        return setResponseValidationSuccess(response.data.message || 'Login erfogreich!');
    } catch (error: unknown) {
        const axiosStatus = isAxiosError(error) ? error.response?.status : null;

        if (axiosStatus === 419 || axiosStatus === 422) {
            // reset cookies and re-fetch cookies
            await initializeCookies();
        }

        return setResponseValidationError(error);
    }
};

export default requestLogin;
