import type { RootState } from '@/store';
import loginReducer from '@/store/loginSlice';
import { PreloadedState } from '@/types/Redux';

export const mockReduxLoggedInState: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: true,
    },
};

export const mockReduxLoggedOutState: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: false,
    },
};
