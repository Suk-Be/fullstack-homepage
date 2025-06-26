import { AxiosError } from 'axios';
import { RegisterResponse } from '../../types/entities';
import { createResponseErrorValidationObject } from './createResponseErrorValidationObject';

export interface ApiErrorData {
    message?: string;
    errors?: { [key: string]: string[] };
}

export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
}

export const setResponseValidationError = (error: unknown): RegisterResponse => {
    if (!isAxiosError(error)) {
        const message =
            error instanceof Error
                ? error.message || 'Ein unerwarteter Fehler ist aufgetreten.'
                : 'Ein unbekannter Fehler ist aufgetreten.';

        return { success: false, message };
    }

    const { response } = error;

    if (!response) {
        return { success: false, message: 'Netzwerkfehler oder Server nicht erreichbar.' };
    }

    const responseData = response.data as ApiErrorData;
    const message = responseData.message ?? '';

    switch (response.status) {
        case 401:
            return createResponseErrorValidationObject(
                message,
                'Nicht autorisiert - ggf. ausgeloggt.',
            );
        case 419:
            return createResponseErrorValidationObject(
                message,
                `CSRF-Token nicht gültig (Status: ${response.status}).`,
            );
        case 422:
            return createResponseErrorValidationObject(
                message,
                'Validierungsfehler.',
                responseData.errors,
            );
        case 500:
            return createResponseErrorValidationObject(
                message,
                'Interner Serverfehler. Bitte versuchen Sie es später erneut.',
            );
        default:
            return createResponseErrorValidationObject(
                message,
                `Ein unerwarteter Fehler ist aufgetreten (Status: ${response.status}).`,
            );
    }
};
