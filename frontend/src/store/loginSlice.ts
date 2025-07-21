import { createSlice } from '@reduxjs/toolkit';

export interface LoginState {
    isLoggedIn: boolean;
    isLoading: boolean;
}

const initialState: LoginState = {
    isLoggedIn: false,
    isLoading: true,
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
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

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
