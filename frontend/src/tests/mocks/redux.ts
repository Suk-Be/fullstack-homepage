import type { RootState } from '@/store';
import loginReducer from '@/store/loginSlice';
import { initialGridConfig, initialLayoutId, initialName } from '@/store/userSaveGridsSlice';
import { userLoggedAdmin, userLoggedInNoAdmin } from '@/tests/mocks/api';
import { PreloadedState, UserSaveGridsState } from '@/types/Redux';
import { vi } from 'vitest';

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

const mockNewLayoutId = 'mock-uuid-1234';
vi.mock('uuid', () => ({
    v4: () => mockNewLayoutId,
}));

const mockInitialState: UserSaveGridsState = {
    userId: null,
    savedGrids: {
        [initialLayoutId]: {
            layoutId: initialLayoutId,
            timestamp: '2023-01-01T00:00:00.000Z',
            config: { ...initialGridConfig },
            name: initialName,
        },
    },
};

const mockStateWithAdmin: UserSaveGridsState = {
    ...mockInitialState,
    userId: userLoggedAdmin,
    name: 'layout-col',
    savedGrids: {
        initialLayoutId: {
            layoutId: initialLayoutId,
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

const mockUPDATEStateWithAdmin: UserSaveGridsState = {
    ...mockInitialState,
    userId: userLoggedAdmin,
    name: 'layout-items',
    savedGrids: {
        [mockNewLayoutId]: {
            layoutId: mockNewLayoutId,
            timestamp: '2023-01-01T00:00:00.000Z',
            name: 'layout-items',
            config: {
                items: '2',
                columns: '2',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
    },
};

const mockLoggedInAdminState: Partial<RootState> = {
    login: {
        isLoggedIn: true,
        isLoading: false,
        error: null,
        role: 'admin' as const,
        userId: userLoggedAdmin,
    },
    userGrid: {
        ...mockInitialState,
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
        ...mockInitialState,
        userId: userLoggedInNoAdmin,
    },
};

const mockLoginStateFulFilled = {
    isLoggedIn: true,
    isLoading: false,
    error: null,
    role: 'user' as const,
};

const mockLoginStatePending = {
    isLoggedIn: false,
    isLoading: true,
    error: null,
    role: null,
};

const mockLoginStateFulFilledGuest = {
    isLoggedIn: false,
    isLoading: false,
    error: null,
    role: null,
};

const mockGuestUserState = {
    login: {
        isLoggedIn: false,
        isLoading: false,
        error: null,
        role: null,
    },
    userGrid: {
        ...mockInitialState,
    },
};

const mockGridReturnedFromBackend = {
    layoutId: 'mock-uuid-1234',
    timestamp: new Date().toISOString(),
    name: 'MyGrid',
    config: {
        items: '1',
        columns: '1',
        gap: '0',
        border: '0',
        paddingX: '0',
        paddingY: '0',
    },
};

const mockLoginStateAdminAction = {
    userId: userLoggedAdmin,
    role: 'admin' as const,
};

const mockLoginStateAdmin = {
    isLoggedIn: true,
    isLoading: true,
    error: null,
    role: 'admin',
};

const mockSaveGridAction = 'MyTestGrid';

export {
    mockGridReturnedFromBackend,
    mockGuestUserState,
    mockLoggedInAdminState,
    mockLoggedInUserState,
    mockLogInState,
    mockLoginStateAdmin,
    mockLoginStateAdminAction,
    mockLogInStateFalse,
    mockLoginStateFulFilled,
    mockLoginStateFulFilledGuest,
    mockLoginStatePending,
    mockSaveGridAction,
    mockStateWithAdmin,
    mockUPDATEStateWithAdmin,
};
