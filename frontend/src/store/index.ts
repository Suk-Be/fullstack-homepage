import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import userGridReducer from './userGridSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        userGrid: userGridReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
