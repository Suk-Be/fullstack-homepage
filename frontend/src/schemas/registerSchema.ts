import z from 'zod';
import ErrorMessages from '../data/ErrorMessages';

export const registerResponseSchema = z
    .object({
        name: z.string().min(1, ErrorMessages.SignUp.name),
        email: z.string().email({ message: ErrorMessages.SignUp.email }),
        password: z.string().min(8, { message: ErrorMessages.SignUp.password }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: ErrorMessages.SignUp.password_confirmation,
        path: ['password_confirmation'],
    });

export const registerInputSchema = z
    .object({
        name: z.string().min(1, ErrorMessages.SignUp.name),
        email: z.string().min(1, ErrorMessages.SignUp.email).email(ErrorMessages.SignUp.email),
        password: z.string().min(8, ErrorMessages.SignUp.password),
        password_confirmation: z.string().min(8, ErrorMessages.SignUp.password_confirmation),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: ErrorMessages.SignUp.password_confirmation,
        path: ['password_confirmation'],
    });

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
