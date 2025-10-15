import requestMe from '@/components/auth/requests/requestMe';
import { BaseClient } from '@/plugins/axios';
import { LoginArgs } from '@/types/Redux';
import { LoginErrorResponse, LoginSuccessResponse } from '@/types/entities';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginThunk = createAsyncThunk<
    LoginSuccessResponse, // ✅ Erfolgstyp
    LoginArgs, // ✅ Argumenttyp
    { rejectValue: LoginErrorResponse } // ✅ Fehlertyp
>('login/loginThunk', async ({ email, password }, { rejectWithValue }) => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.auth.login);
        await initializeCookies();

        const response = await BaseClient.post('/login', {
            email,
            password,
            recaptcha_token: recaptchaToken,
        });

        const meResult = await requestMe();

        if (meResult?.success && meResult.userId !== undefined && meResult.role) {
            return {
                success: true,
                message: response.data.message || 'Login erfolgreich!',
                userId: meResult.userId,
                role: meResult.role,
            };
        } else {
            return rejectWithValue({
                success: false,
                message: 'Benutzer konnte nicht geladen werden',
            });
        }
    } catch (error: unknown) {
        await resetCookiesOnResponseError(error);
        return rejectWithValue(setResponseValidationError(error));
    }
});
