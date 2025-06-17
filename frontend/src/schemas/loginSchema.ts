import z from 'zod';
import ErrorMessages from '../data/ErrorMessages';

export const LoginSchema = z.object({
    email: z.string().email({ message: ErrorMessages.SignIn.email }),
    password: z.string().min(8, { message: ErrorMessages.SignIn.password }),
    responseEmail: z.string().email({ message: ErrorMessages.SignIn.responseEmail }),
});

export type LoginFormattedErrors = z.inferFormattedError<typeof LoginSchema>;
