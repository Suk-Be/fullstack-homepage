import { LoginState } from '@/store/loginSlice';
import { userLoggedAdmin, userLoggedInNoAdmin } from '@/tests/mocks/api';
import { UserSaveGridsState } from '@/types/Redux';

const loginBase: LoginState = {
    userId: undefined,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    fieldErrors: undefined,
    role: null,
};

const userGridBase: UserSaveGridsState = {
    userId: null,
    savedGrids: {},
};

export const authTestStates = {
    admin: {
        login: { ...loginBase, isLoggedIn: true, userId: userLoggedAdmin, role: 'admin' as const },
        userGrid: { ...userGridBase },
    },
    user: {
        login: {
            ...loginBase,
            isLoggedIn: true,
            userId: userLoggedInNoAdmin,
            role: 'user' as const,
        },
        userGrid: { ...userGridBase },
    },
    null: {
        login: { ...loginBase, isLoggedIn: false, role: null },
        userGrid: { ...userGridBase },
    },
} as const;
