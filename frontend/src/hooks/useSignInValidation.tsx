import ErrorMessages from '../data/ErrorMessages';

export interface ValidationResult {
    isValid: boolean;
    emailError: boolean;
    emailErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
}

/**
 * Validates email and password input fields for the SignIn form.
 */
export function validateSignInInputs(email: string, password: string): ValidationResult {
    let isValid = true;

    const result: ValidationResult = {
        isValid: true,
        emailError: false,
        emailErrorMessage: '',
        passwordError: false,
        passwordErrorMessage: '',
    };

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        result.emailError = true;
        result.emailErrorMessage = ErrorMessages.SignUp.email;
        isValid = false;
    }

    if (!password || password.length < 6) {
        result.passwordError = true;
        result.passwordErrorMessage = ErrorMessages.SignUp.password;
        isValid = false;
    }

    result.isValid = isValid;
    return result;
}
