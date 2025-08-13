import requestMe from '@/components/auth/api/requestMe';
import LaravelApiClient from '@/plugins/axios';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetUserGrid } from './userSaveGridsSlice';

import { LoginArgs, User } from '@/types/Redux';
import { LoginErrorResponse, LoginSuccessResponse } from '@/types/entities';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';

// ---------- Typen ----------
export interface LoginResult {
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
    user?: User;
    userId?: number;
}

export interface LoginState {
    userId: number | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    fieldErrors?: Record<string, string[]>;
}

const initialState: LoginState = {
    userId: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
    fieldErrors: undefined,
};

// ---------- AsyncThunk ----------
export const loginThunk = createAsyncThunk<
    LoginSuccessResponse, // ✅ Erfolgstyp
    LoginArgs, // ✅ Argumenttyp
    { rejectValue: LoginErrorResponse } // ✅ Fehlertyp
>('login/loginThunk', async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
        await initializeCookies();
        // console.log('in here');

        const response = await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        const meResult = await requestMe();

        if (meResult?.success && meResult.userId !== undefined) {
            return {
                success: true,
                message: response.data.message || 'Login erfolgreich!',
                userId: meResult.userId,
            };
        } else {
            return rejectWithValue({
                success: false,
                message: 'Benutzer konnte nicht geladen werden',
            });
        }
    } catch (error: unknown) {
        // console.log('catch loginThunk, get here:', LaravelApiClient.defaults.baseURL + '/auth/spa/login', 'mit body:', { error });

        dispatch(resetUserGrid());
        await resetCookiesOnResponseError(error);
        return rejectWithValue(setResponseValidationError(error));
    }
});

// ---------- Slice ----------
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        startAuth(state) {
            state.isLoading = true;
        },
        logout(state) {
            state.userId = null;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.error = null;
            state.fieldErrors = undefined;
        },
        forceLogin(state, action: PayloadAction<number>) {
            state.userId = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
            state.fieldErrors = undefined;
        },
        login(state) {
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
            state.fieldErrors = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.fieldErrors = undefined;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.userId = action.payload.userId ?? null;
                    state.isLoggedIn = true;
                }
                state.isLoading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                if (action.payload?.success === false) {
                    state.error =
                        action.payload.message ?? 'Ein unbekannter Fehler ist aufgetreten.';
                    state.fieldErrors = action.payload.fieldErrors;
                } else {
                    state.error = 'Unbekannter Fehler beim Login.';
                }
            });
    },
});

export const { startAuth, logout, forceLogin } = loginSlice.actions;
export default loginSlice.reducer;
