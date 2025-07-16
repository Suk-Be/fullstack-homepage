import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import layoutReducer from './layoutSlice';
import loginReducer from './loginSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        layout: layoutReducer,
        counter: counterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
