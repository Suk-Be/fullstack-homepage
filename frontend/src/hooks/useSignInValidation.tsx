import ErrorMessages from '../data/ErrorMessages';

export interface ValidationResult {
    isValid: boolean;
    emailError: boolean;
    emailErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
}

/**
 * Validates input fields for the SignIn form.
 */
export function validateSignInInputs(email: string, password: string): ValidationResult {
    // init
    let isValid = true;
    const result: ValidationResult = {
        isValid: true,
        emailError: false,
        emailErrorMessage: '',
        passwordError: false,
        passwordErrorMessage: '',
    };

    // validate
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        result.emailError = true;
        result.emailErrorMessage = ErrorMessages.SignUp.email;
        isValid = false;
    }

    if (!password || password.length < 8) {
        result.passwordError = true;
        result.passwordErrorMessage = ErrorMessages.SignUp.password;
        isValid = false;
    }

    // return validation result
    result.isValid = isValid;
    return result;
}
