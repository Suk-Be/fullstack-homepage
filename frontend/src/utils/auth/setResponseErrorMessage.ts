/**
 * Is used if post request responses with an 422
 * laravel validates login if credentials like email or password do not exist
 *
 * Extracts the first error message for a given field from a server-side error response.
 *
 * This utility is useful for parsing structured API validation errors where
 * each field maps to an array of error messages.
 *
 * @param errors - An object containing arrays of error messages keyed by field name.
 * @param field - The name of the field whose error message should be retrieved.
 * @param fallback - A default message to return if no error is present for the field.
 * @returns The first error message for the specified field, or the fallback if none exists.
 *
 * @example
 * const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
 * const errors = { email: ["E-Mail ist ungültig"], password: ["Zu kurz"] };
 * const msg = getResponseErrorMessage(errors, "email", "Unbekannter Fehler");
 * // msg === "E-Mail ist ungültig"
 */

const setResponseErrorMessage = (
    errors: { [key: string]: string[] },
    field: string,
    fallback: string = '',
) => (Array.isArray(errors[field]) && errors[field].length > 0 ? errors[field][0] : fallback);

export default setResponseErrorMessage;
