import LaravelApiClient from '../../../plugins/axios';
// import { translateHttpError } from '../../../utils/auth/translateHttpError';
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
        const response = await LaravelApiClient.post('/auth/spa/reset-password', {
            email,
            password,
            password_confirmation, // Laravel erwartet dies
            token,
        });
        return setResponseValidationSuccess( response.data.message || 'Passwort wurde erfolgreich zurückgesetzt!');
    } catch (error: any) {
        return setResponseValidationError(error);
    }
};

export default resetPassword;
