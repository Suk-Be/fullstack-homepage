import { ResetPasswordInput, resetPasswordInputSchema } from '../../../schemas/resetPasswordSchema';

export interface ValidationResult {
    isValid: boolean;
    passwordError: boolean;
    passwordErrorMessage: string;
    passwordConfirmationError: boolean;
    passwordConfirmationErrorMessage: string;
    tokenError: boolean;
    tokenErrorMessage: string | null;
}

export default function validateInputs(data: ResetPasswordInput): ValidationResult {
    const result = resetPasswordInputSchema.safeParse(data);

    if (result.success) {
        return {
            isValid: true,
            passwordError: false,
            passwordErrorMessage: '',
            passwordConfirmationError: false,
            passwordConfirmationErrorMessage: '',
            tokenError: false,
            tokenErrorMessage: '',
        };
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    return {
        isValid: false,
        passwordError: !!fieldErrors.password,
        passwordErrorMessage: fieldErrors.password?.[0] || '',
        passwordConfirmationError: !!fieldErrors.password_confirmation,
        passwordConfirmationErrorMessage: fieldErrors.password_confirmation?.[0] || '',
        tokenError: !!fieldErrors.token,
        tokenErrorMessage: fieldErrors.token?.[0] || '',
    };
}
