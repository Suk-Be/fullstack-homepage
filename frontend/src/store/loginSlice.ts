import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
    userId: number | null;
    isLoggedIn: boolean;
    isLoading: boolean;
}

const initialState: LoginState = {
    userId: null,
    isLoggedIn: false,
    isLoading: true,
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<number>) {
            state.userId = action.payload;
        },
        login: (state) => {
            state.isLoggedIn = true;
            state.isLoading = false;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.isLoading = false;
        },
    },
});

export const { setUserId, login, logout } = loginSlice.actions;
export default loginSlice.reducer;
