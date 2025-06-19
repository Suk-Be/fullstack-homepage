import { AxiosError } from 'axios';

export interface ApiErrorData {
    message?: string;
    errors?: { [key: string]: string[] };
}

export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
}

export const translateHttpError = (error: unknown): string => {
    if (!isAxiosError(error)) {
        if (error instanceof Error) {
            return error.message || 'Ein unerwarteter Fehler ist aufgetreten.';
        }
        return 'Ein unbekannter Fehler ist aufgetreten.';
    }

    const { response } = error;

    if (!response) {
        return 'Netzwerkfehler oder Server nicht erreichbar.';
    }

    const responseData = response.data as ApiErrorData;
    const message = responseData.message;

    switch (response.status) {
        case 401:
            return message || 'Nicht autorisiert - ggf. ausgeloggt.';
        case 419:
            return message || 'Sitzung abgelaufen oder CSRF-Token abgelaufen.';
        case 422:
            return message || 'Validierungsfehler.';
        case 404:
            return message || 'Die angeforderte Ressource wurde nicht gefunden.';
        case 500:
            return message || 'Interner Serverfehler. Bitte versuchen Sie es später erneut.';
        default:
            return message || `Ein Fehler ist aufgetreten (Status: ${response.status}).`;
    }
};
