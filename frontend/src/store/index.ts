import { logReduxState } from '@/utils/logger';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import userSaveGridsReducer from './userSaveGridsSlice';

export const rootReducer = combineReducers({
    login: loginReducer,
    userGrid: userSaveGridsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // z.B. für Date-Objekte in Grid config
        }),
});

// logging state updates
export const subscribeLogging = () => {
    let lastLoginState = store.getState().login;
    let lastGridState = store.getState().userGrid;

    store.subscribe(() => {
        const state = store.getState();
        if (state.login !== lastLoginState) {
            lastLoginState = state.login;
            logReduxState('login', state.login);
        }
        if (state.userGrid !== lastGridState) {
            lastGridState = state.userGrid;
            logReduxState('userGrid', state.userGrid);
        }
    });
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
