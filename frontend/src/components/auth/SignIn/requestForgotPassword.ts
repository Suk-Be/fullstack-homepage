import LaravelApiClient from '../../../plugins/axios'; // Ihr Axios-Client
import { translateHttpError } from '../../../utils/auth/translateHttpError';

interface RequestPasswordResetResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
}

const requestForgotPassword = async (email: string): Promise<RequestPasswordResetResult> => {
    try {
        const response = await LaravelApiClient.post('/auth/spa/forgot-password', { email });
        return {
            success: true,
            message: response.data.message || 'Passwort-Reset-Link wurde gesendet!',
        };
    } catch (error: any) {
        // console.error('Request password reset link API error:', error.response);

        if (error.response?.status === 422 || error.response?.status === 404) {
            return {
                success: false,
                message: translateHttpError(error) || 'Validierungsfehler.',
                errors: error.response.data.errors || {},
            };
        }

        return {
            success: false,
            message: translateHttpError(error) || 'Fehler beim Senden des Passwort-Reset-Links.',
            errors: { email: ['Ein Problem ist aufgetreten. Bitte versuchen Sie es erneut.'] },
        };
    }
};

export default requestForgotPassword;
