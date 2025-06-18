import { z, ZodFormattedError } from 'zod';
import ErrorMessages from '../data/ErrorMessages';

export const ResetPasswordSchema = z
    .object({
        email: z.string().email('Ungültige E-Mail-Adresse.').min(1, ErrorMessages.ResetPassword.email),
        password: z
            .string()
            .min(8, ErrorMessages.ResetPassword.password)
            .min(1, ErrorMessages.ResetPassword.password),
        password_confirmation: z.string().min(1, ErrorMessages.ResetPassword.password_confirmation),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwörter stimmen nicht überein.',
        path: ['password_confirmation'], // Zeigt den Fehler beim Bestätigungsfeld an
    });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
export type ResetPasswordFormattedErrors = ZodFormattedError<z.infer<typeof ResetPasswordSchema>>;
