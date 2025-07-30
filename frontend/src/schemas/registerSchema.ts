import ErrorMessages from '@/data/ErrorMessages';
import z from 'zod';

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

export type RegisterInput = z.infer<typeof registerInputSchema>;
