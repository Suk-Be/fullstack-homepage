import LaravelApiClient from '../../../plugins/axios';
import { RegisterFormData, RegisterResponse } from '../../../types/entities';
import { setResponseValidationError } from '../../../utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '../../../utils/auth/setResponseValidationSuccess';
import requestMe from './requestMe';

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
        await LaravelApiClient.post('/auth/spa/register', form);
        success = true;

        if (shouldFetchUser && success === true) await requestMe(shouldFetchUser);

        return setResponseValidationSuccess('Die Registrierung hat geklappt!');
    } catch (error: any) {
        return setResponseValidationError(error);
    }
};

export default requestRegister;
