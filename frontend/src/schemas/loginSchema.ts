import ErrorMessages from '@/data/ErrorMessages';
import z from 'zod';

// testing mock schema
export const loginResponseSchema = z.object({
    email: z.string().email({ message: ErrorMessages.SignIn.responseEmail }),
    password: z.string().min(1, { message: ErrorMessages.SignIn.password }),
});

export const loginInputSchema = z.object({
    email: z
        .string()
        .min(5, ErrorMessages.SignIn.email)
        .max(60, ErrorMessages.SignIn.emailLength)
        .email(ErrorMessages.SignIn.email),
    password: z
        .string()
        .min(8, ErrorMessages.SignIn.password)
        .max(128, ErrorMessages.SignIn.passwordLength),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
