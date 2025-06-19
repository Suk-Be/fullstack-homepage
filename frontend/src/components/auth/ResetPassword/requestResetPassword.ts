import LaravelApiClient from '../../../plugins/axios';
import translateHttpError from '../../../utils/auth/translateHttpError';

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
        return {
            success: true,
            message: response.data.message || 'Passwort wurde erfolgreich zurückgesetzt!',
        };
    } catch (error: any) {
        console.error('Reset password API error:', error.response);

        if (error.response?.status === 422) {
            return {
                success: false,
                message: error.response.data.message || 'Validierungsfehler.',
                errors: error.response.data.errors || {},
            };
        }
        return {
            success: false,
            message: translateHttpError(error) || 'Fehler beim Zurücksetzen des Passworts.',
            errors: {
                general: ['Ein unerwarteter Fehler ist aufgetreten.'],
            },
        };
    }
};

export default resetPassword;
