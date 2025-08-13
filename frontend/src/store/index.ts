import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import UserSaveGridsReducer from './userSaveGridsSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        userGrid: UserSaveGridsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
