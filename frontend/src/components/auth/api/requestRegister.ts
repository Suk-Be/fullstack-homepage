import requestMe from '@/components/auth/api/requestMe';
import LaravelApiClient from '@/plugins/axios';
import { RegisterFormData, RegisterResponse } from '@/types/entities';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface RegisterUserParams {
    shouldFetchUser: boolean;
    form: RegisterFormData;
}

const requestRegister = async ({
    shouldFetchUser,
    form,
}: RegisterUserParams): Promise<RegisterResponse> => {
    let success = false;

    try {
        await initializeCookies();
        await LaravelApiClient.post('/auth/spa/register', form);
        success = true;

        if (shouldFetchUser && success === true) await requestMe(shouldFetchUser);

        return setResponseValidationSuccess('Die Registrierung hat geklappt!');
    } catch (error: any) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);
        return setResponseValidationError(error);
    }
};

export default requestRegister;
