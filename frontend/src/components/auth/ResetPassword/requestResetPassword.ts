import LaravelApiClient from '../../../plugins/axios';
import { setResponseValidationError } from '../../../utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '../../../utils/auth/setResponseValidationSuccess';

interface ResetPasswordResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
}

const resetPassword = async (
    email: string,
    password: string,
    password_confirmation: string,
    token: string,
): Promise<ResetPasswordResult> => {    
    try {
        // console.log('in try, before post: ', email, password, password_confirmation, token)
        const response = await LaravelApiClient.post('/auth/spa/reset-password', {
            email,
            password,
            password_confirmation, 
            token,
        });
        // console.log('in try, after post: ', email, password, password_confirmation, token)
        return setResponseValidationSuccess( response.data.message || 'Passwort wurde erfolgreich zurückgesetzt!');
    } catch (error: any) {
        return setResponseValidationError(error);
    }
};

export default resetPassword;
