import ErrorMessages from '@/data/ErrorMessages';
import z from 'zod';

export const loginResponseSchema = z.object({
    email: z.string().email({ message: ErrorMessages.SignIn.responseEmail }),
    password: z.string().min(8, { message: ErrorMessages.SignIn.password }),
});

export const loginInputSchema = z.object({
    email: z.string().min(1, ErrorMessages.SignIn.email).email(ErrorMessages.SignIn.email),
    password: z.string().min(8, ErrorMessages.SignIn.password),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
