import userGridReducer, {
    loadUserGrids,
    persistGridsinLocalStorage,
    resetUserGrid,
    saveInitialGridAsUUID,
    updateInitialGrid,
    initialState as userGridInitialState,
} from '@/store/userSaveGridsSlice';
import { UserSaveGridsState } from '@/types/Redux';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

const mockNewLayoutId = 'mock-uuid-1234';

// mock uuid
vi.mock('uuid', () => ({
    v4: () => mockNewLayoutId,
}));

// mock localStorage utils
vi.mock('@/store/localStorage', () => ({
    loadFromLocalStorage: vi.fn(),
    saveToLocalStorage: vi.fn(),
}));

describe('userSaveGridsSlice', () => {
    let initialState: UserSaveGridsState;
    let saveToLocalStorage: ReturnType<typeof vi.fn>;
    let loadFromLocalStorage: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        vi.clearAllMocks();
        const localStorageModule = await import('@/store/localStorage');
        saveToLocalStorage = localStorageModule.saveToLocalStorage as unknown as Mock;
        loadFromLocalStorage = localStorageModule.loadFromLocalStorage as unknown as Mock;

        // ✅ jedes Mal frisch klonen
        initialState = structuredClone(userGridInitialState);
    });

    it('should return the initial state', () => {
        expect(userGridReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle saveInitialGridAsNew when userId exists', () => {
        const stateWithUser: UserSaveGridsState = {
            ...initialState,
            userId: 1,
            savedGrids: {
                ...initialState.savedGrids,
                initial: {
                    ...initialState.savedGrids.initial,
                    config: {
                        items: '3',
                        columns: '4',
                        gap: '3',
                        border: '1',
                        paddingX: '5',
                        paddingY: '3',
                    },
                },
            },
        };

        const result = userGridReducer(stateWithUser, saveInitialGridAsUUID());

        expect(Object.keys(result.savedGrids)).toContain(mockNewLayoutId);
        expect(result.savedGrids[mockNewLayoutId]).toMatchObject({
            layoutId: mockNewLayoutId,
            config: stateWithUser.savedGrids.initial.config,
        });
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle updateGrid when userId and layoutId exist', () => {
        const stateWithUser: UserSaveGridsState = {
            ...initialState,
            userId: 1,
            savedGrids: {
                [mockNewLayoutId]: {
                    layoutId: mockNewLayoutId,
                    timestamp: '2023-01-01T00:00:00.000Z',
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

        const result = userGridReducer(
            stateWithUser,
            updateInitialGrid({ layoutId: mockNewLayoutId, key: 'items', value: '99' }),
        );

        expect(result.savedGrids[mockNewLayoutId].config.items).toBe('99');
        expect(typeof result.savedGrids[mockNewLayoutId].timestamp).toBe('string');
    });

    it('should handle resetUserGrid', () => {
        const modifiedState: UserSaveGridsState = {
            userId: 1,
            savedGrids: {
                [mockNewLayoutId]: {
                    layoutId: mockNewLayoutId,
                    timestamp: '2023-01-01T00:00:00.000Z',
                    config: {
                        items: '3',
                        columns: '4',
                        gap: '3',
                        border: '1',
                        paddingX: '5',
                        paddingY: '3',
                    },
                },
            },
        };

        const result = userGridReducer(modifiedState, resetUserGrid());
        expect(result).toEqual(initialState);
    });

    it('should handle loadUserGrids and persist to localStorage', () => {
        const customState: UserSaveGridsState = {
            userId: 42,
            savedGrids: {
                abc: {
                    layoutId: 'abc',
                    timestamp: '2023-01-01T00:00:00.000Z',
                    config: {
                        items: '2',
                        columns: '2',
                        gap: '1',
                        border: '0',
                        paddingX: '0',
                        paddingY: '0',
                    },
                },
            },
        };

        const result = userGridReducer(initialState, loadUserGrids(customState));

        expect(result.userId).toBe(42);
        expect(result.savedGrids).toHaveProperty('abc');
    });

    it('should handle persistGridsinLocalStorage and load savedGrids', async () => {
        const mockSavedState: UserSaveGridsState = {
            userId: 1,
            savedGrids: {
                test123: {
                    layoutId: 'test123',
                    timestamp: '2023-01-01T00:00:00.000Z',
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

        const { loadFromLocalStorage } = await import('@/store/localStorage');
        (loadFromLocalStorage as Mock).mockReturnValue(mockSavedState);

        const result = userGridReducer(initialState, persistGridsinLocalStorage(1));

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockSavedState.savedGrids);
    });
});
