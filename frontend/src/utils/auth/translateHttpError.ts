export const translateHttpError = (error: any) => {
    if (!error.response) return 'Unbekannter Fehler';
    const status = error.response.status;
    const message = error.response.data?.message;

    if (status === 401) return message || 'Nicht autorisiert – ggf. ausgeloggt';
    if (status === 419) return message || 'CSRF-Token abgelaufen';
    if (status === 422) return message || 'Validierungsfehler';
    return message || 'Ein Fehler ist aufgetreten';
};

export default translateHttpError;
