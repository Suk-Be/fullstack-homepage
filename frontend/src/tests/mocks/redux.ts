import type { RootState } from '@/store';
import loginReducer from '@/store/loginSlice';
import { initialState } from '@/store/userSaveGridsSlice';
import { PreloadedState, UserSaveGridsState } from '@/types/Redux';
import { vi } from 'vitest';
import { userLoggedAdmin, userLoggedInNoAdmin } from './api';

const mockLogInState: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: true,
    },
};

const mockLogInStateFalse: PreloadedState<RootState> = {
    login: {
        ...loginReducer(undefined, { type: '@@INIT' }),
        isLoggedIn: false,
    },
};

const mockStateWithUserId1: UserSaveGridsState = {
    userId: 1,
    name: 'layout-col',
    savedGrids: {
        initial: {
            layoutId: '1',
            timestamp: '2023-01-01T00:00:00.000Z',
            name: 'initial',
            config: {
                items: '1',
                columns: '1',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
        layout: {
            layoutId: '2',
            timestamp: '2023-01-01T00:00:00.000Z',
            name: 'layout-col',
            config: {
                items: '5',
                columns: '5',
                gap: '1',
                border: '1',
                paddingX: '2',
                paddingY: '2',
            },
        },
    },
};

const mockNewLayoutId = 'mock-uuid-1234';
vi.mock('uuid', () => ({
    v4: () => mockNewLayoutId,
}));

const mockUPDATEStateWithUserId1: UserSaveGridsState = {
    ...initialState,
    userId: 1,
    name: 'layout-items',
    savedGrids: {
        [mockNewLayoutId]: {
            layoutId: mockNewLayoutId,
            timestamp: '2023-01-01T00:00:00.000Z',
            name: 'layout-items',
            config: {
                items: '1',
                columns: '1',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
    },
};

const mockLoggedInAdminState = {
    login: {
        isLoggedIn: true,
        isLoading: false,
        error: null,
        role: 'admin' as const,
    },
    userGrid: {
        ...initialState,
        userId: userLoggedAdmin,
    },
};

const mockLoggedInUserState = {
    login: {
        isLoggedIn: true,
        isLoading: false,
        error: null,
        role: 'user' as const,
    },
    userGrid: {
        ...initialState,
        userId: userLoggedInNoAdmin,
    },
};

const mockGuestUserState = {
    login: {
        isLoggedIn: false,
        isLoading: true,
        error: null,
        role: null,
    },
    userGrid: {
        userId: null,
        savedGrids: {
            initial: {
                layoutId: 'initial',
                timestamp: '2025-09-18T11:29:54.894Z',
                config: {
                    items: '1',
                    columns: '1',
                    gap: '0',
                    border: '0',
                    paddingX: '0',
                    paddingY: '0',
                },
                name: 'initial',
            },
        },
    },
};

export {
    mockGuestUserState,
    mockLoggedInAdminState,
    mockLoggedInUserState,
    mockLogInState,
    mockLogInStateFalse,
    mockStateWithUserId1,
    mockUPDATEStateWithUserId1,
};
