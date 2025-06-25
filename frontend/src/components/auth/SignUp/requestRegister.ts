import LaravelApiClient from '../../../plugins/axios';
import { RegisterFormData, RegisterResponse } from '../../../types/entities';
import { setResponseValidationError } from '../../../utils/auth/setResponseValidationError';
import requestMe from './requestMe';

interface RegisterUserParams {
    shouldFetchUser: boolean;
    form: RegisterFormData;
}

const requestRegister = async ({
    shouldFetchUser,
    form,
}: RegisterUserParams): Promise<RegisterResponse> => {
    // laravel expects snake case and naming convention different than in the frontend
    const { passwordConfirmation, ...rest } = form;
    let success = false;

    try {
        await LaravelApiClient.post('/auth/spa/register', {
            ...rest,
            password_confirmation: passwordConfirmation,
        });
        success = true;
        if (shouldFetchUser && success === true) await requestMe(shouldFetchUser);

        return { success: true, message: 'Die Registrierung hat geklappt!' };
    } catch (error: any) {
        return setResponseValidationError(error);
    }
};

export default requestRegister;
