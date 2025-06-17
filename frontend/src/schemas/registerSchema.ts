import z from 'zod';

export const RegisterSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    });
