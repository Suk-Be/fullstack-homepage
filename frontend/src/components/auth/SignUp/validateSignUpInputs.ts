import { RegisterInput, registerInputSchema } from '../../../schemas/registerSchema';

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

export default function validateInputs(data: RegisterInput): ValidationResult {
    const result = registerInputSchema.safeParse(data);

    if (result.success) {
        return {
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
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    return {
        isValid: false,
        nameError: !!fieldErrors.name,
        nameErrorMessage: fieldErrors.name?.[0] || '',
        emailError: !!fieldErrors.email,
        emailErrorMessage: fieldErrors.email?.[0] || '',
        passwordError: !!fieldErrors.password,
        passwordErrorMessage: fieldErrors.password?.[0] || '',
        passwordConfirmationError: !!fieldErrors.password_confirmation,
        passwordConfirmationErrorMessage: fieldErrors.password_confirmation?.[0] || '',
    };
}
