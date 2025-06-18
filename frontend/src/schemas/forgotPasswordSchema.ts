import { z, ZodFormattedError } from 'zod';

export const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .email('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
        .min(1, 'Bitte geben Sie Ihre E-Mail-Adresse ein.'),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
export type ForgotPasswordFormattedErrors = ZodFormattedError<z.infer<typeof ForgotPasswordSchema>>;
