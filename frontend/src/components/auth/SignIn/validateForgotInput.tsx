import ErrorMessages from '../../../data/ErrorMessages';

export interface ValidationResult {
    isValid: boolean;
    emailError: boolean;
    emailErrorMessage: string;
}

export function validateForgotPasswordInput(email: string): ValidationResult {
    let isValid = true;
    const result: ValidationResult = {
        isValid: true,
        emailError: false,
        emailErrorMessage: '',
    };

    // validate input and response error
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        result.emailError = true;
        result.emailErrorMessage = ErrorMessages.SignUp.email;
        isValid = false;
    }

    result.isValid = isValid;
    return result;
}
