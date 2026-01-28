import { ForgotPasswordInput, forgotPasswordInputSchema } from '@/schemas/forgotPasswordSchema';

export function validateForgotPasswordInput(data: ForgotPasswordInput) {
    const result = forgotPasswordInputSchema.safeParse(data);

    if (result.success) {
        return {
            isValid: true,
            emailError: false,
            emailErrorMessage: '',
        };
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    return {
        isValid: false,
        emailError: !!fieldErrors.email,
        emailErrorMessage: fieldErrors.email?.[0] || '',
    };
}
