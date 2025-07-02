import z from 'zod';
import ErrorMessages from '../data/ErrorMessages';

export const resetPasswordInputSchema = z
    .object({
        password: z.string().min(8, { message: ErrorMessages.ResetPassword.password }),
        password_confirmation: z.string().min(1, ErrorMessages.ResetPassword.password_confirmation),
        token: z.string().min(6, ErrorMessages.ResetPassword.token),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwörter stimmen nicht überein.',
        path: ['password_confirmation'], // Zeigt den Fehler beim Bestätigungsfeld an
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
