import ErrorMessages from '@/data/ErrorMessages';
import { z } from 'zod';

export const forgotPasswordResponseSchema = z.object({
    email: z.string().email(ErrorMessages.ForgotPassword.responseEmail),
});

export const forgotPasswordInputSchema = z.object({
    email: z
        .string()
        .min(1, ErrorMessages.ForgotPassword.email)
        .email({ message: ErrorMessages.ForgotPassword.email }),
});

export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
