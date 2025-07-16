import type { RootState } from '@/store';
import layoutReducer from '@/store/layoutSlice';
import loginReducer from '@/store/loginSlice';
import { PreloadedState } from '@/types/Redux';

export const mockReduxLoggedInState: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: true,
    },
    layout: layoutReducer(undefined, { type: '@@INIT' }),
};

export const mockReduxLoggedOutState: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: false,
    },
    layout: layoutReducer(undefined, { type: '@@INIT' }),
};
