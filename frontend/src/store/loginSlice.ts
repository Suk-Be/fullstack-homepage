import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginThunk } from '@/store/thunks/loginThunk';
import { User } from '@/types/Redux';

// ---------- Typen ----------
export interface LoginResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    user?: User;
    userId?: number;
}

export interface LoginState {
    userId?: number;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    fieldErrors?: Record<string, string[]>;
    role?: 'admin' | 'user' | null;
}

const initialState: LoginState = {
    userId: undefined,
    isLoggedIn: false,
    isLoading: true,
    error: null,
    fieldErrors: undefined,
    role: null,
};

// ---------- AsyncThunk ----------

// ---------- Slice ----------
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        startAuth(state) {
            state.isLoading = true;
        },
        logout(state) {
            state.userId = undefined;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.error = null;
            state.fieldErrors = undefined;
        },
        forceLogin(
            state,
            action: PayloadAction<{ userId: number; role: 'admin' | 'user' | null }>,
        ) {
            state.userId = action.payload.userId;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
            state.fieldErrors = undefined;
            state.role = action.payload.role;
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
                    state.userId = action.payload.userId ?? undefined;
                    state.role = action.payload.role ?? null;
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
