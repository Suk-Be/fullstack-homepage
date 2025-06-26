import LaravelApiClient from '../../../plugins/axios';
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
        const response = await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        await requestMe(shouldFetchUser);

        return setResponseValidationSuccess( response.data.message || 'Login erfogreich!');
    } catch (error: unknown) {
        return setResponseValidationError(error);
    }
};

export default requestLogin;
