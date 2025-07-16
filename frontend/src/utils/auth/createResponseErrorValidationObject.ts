/**
 * Creates a error response object for form validations.
 *
 * @param {string} message - The response.data.message from the API response.
 * @param {string} defaultMessage - A fallback message to use if `message` is empty or null.
 * @param {object.<string, string[]>} [fieldErrors] - only received by 419 responses (laravel standard)
 * @returns {RegisterResponse} An object that is used for form validation, e.g. email exists validation.
 */

import { RegisterResponse } from '@/types/entities';

export const createResponseErrorValidationObject = (
    message: string,
    defaultMessage: string,
    fieldErrors?: { [key: string]: string[] },
): RegisterResponse => {
    return {
        success: false,
        message: message || defaultMessage,
        fieldErrors,
    };
};
