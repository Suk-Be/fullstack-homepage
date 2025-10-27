import ErrorMessages from '@/data/ErrorMessages';
import z from 'zod';

export const registerInputSchema = z
    .object({
        name: z.string().min(1, ErrorMessages.SignUp.name).max(50, ErrorMessages.SignUp.nameLength),
        email: z
            .string()
            .min(5, ErrorMessages.SignUp.email)
            .max(60, ErrorMessages.SignUp.emailLength)
            .email(ErrorMessages.SignUp.email),
        password: z
            .string()
            .min(8, ErrorMessages.SignUp.password)
            .max(128, ErrorMessages.SignUp.passwordLength),
        password_confirmation: z
            .string()
            .min(8, ErrorMessages.SignUp.password_confirmation)
            .max(128, ErrorMessages.SignUp.passwordLength),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: ErrorMessages.SignUp.password_confirmation,
        path: ['password_confirmation'],
    });

export type RegisterInput = z.infer<typeof registerInputSchema>;
