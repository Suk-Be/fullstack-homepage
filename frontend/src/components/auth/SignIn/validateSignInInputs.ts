import { LoginInput, loginInputSchema } from '../../../schemas/loginSchema';

export function validateSignInInputs(data: LoginInput) {
    const result = loginInputSchema.safeParse(data);

    if (result.success) {
        return {
            isValid: true,
            emailError: false,
            emailErrorMessage: '',
            passwordError: false,
            passwordErrorMessage: '',
        };
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    return {
        isValid: false,
        emailError: !!fieldErrors.email,
        emailErrorMessage: fieldErrors.email?.[0] || '',
        passwordError: !!fieldErrors.password,
        passwordErrorMessage: fieldErrors.password?.[0] || '',
    };
}