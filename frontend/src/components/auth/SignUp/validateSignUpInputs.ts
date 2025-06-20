import ErrorMessages from '../../../data/ErrorMessages';

export interface ValidationResult {
    isValid: boolean;
    emailError: boolean;
    emailErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
    passwordConfirmationError: boolean;
    passwordConfirmationErrorMessage: string;
    nameError: boolean;
    nameErrorMessage: string;
}

/**
 * Validates input fields for the SignUp form.
 */

export default function validateInputs(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
) {
    // init
    let isValid = true;
    const result: ValidationResult = {
        isValid: true,
        nameError: false,
        nameErrorMessage: '',
        emailError: false,
        emailErrorMessage: '',
        passwordError: false,
        passwordErrorMessage: '',
        passwordConfirmationError: false,
        passwordConfirmationErrorMessage: '',
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

    if (!passwordConfirmation || passwordConfirmation !== password) {
        result.passwordConfirmationError = true;
        result.passwordConfirmationErrorMessage = ErrorMessages.SignUp.password_confirmation;
        isValid = false;
    }

    if (!name || name.length < 1) {
        result.nameError = true;
        result.nameErrorMessage = ErrorMessages.SignUp.name;
        isValid = false;
    }

    // return validation result
    result.isValid = isValid;
    return result;
}
