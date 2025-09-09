import userGridReducer, {
  deleteThisGrid,
  getGridsFromLocalStorage,
  loadUserGrids,
  resetUserGrids,
  saveInitialGrid,
  updateGridConfig,
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
    clearUserGridsFromLocalStorage: vi.fn(),
}));

describe('userSaveGridsSlice', () => {
    let initialState: UserSaveGridsState;
    let saveToLocalStorage: ReturnType<typeof vi.fn>;
    let loadFromLocalStorage: ReturnType<typeof vi.fn>;
    let clearUserGridsFromLocalStorage: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        vi.clearAllMocks();

        const localStorageModule = await import('@/store/localStorage');
        saveToLocalStorage = localStorageModule.saveToLocalStorage as Mock;
        loadFromLocalStorage = localStorageModule.loadFromLocalStorage as Mock;
        clearUserGridsFromLocalStorage = localStorageModule.clearUserGridsFromLocalStorage as Mock;

        // ✅ jedes Mal frisch klonen
        initialState = JSON.parse(JSON.stringify(userGridInitialState));
    });

    it('should return the initial state', () => {
        expect(userGridReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle getGridsFromLocalStorage', () => {
        const mockSavedState: UserSaveGridsState = {
            userId: 1,
            name: 'layout-col',
            savedGrids: {
                layout: {
                    layoutId: 'test123',
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

        loadFromLocalStorage.mockReturnValue(mockSavedState);

        const action = getGridsFromLocalStorage(1);
        const result = userGridReducer(initialState, action);

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockSavedState.savedGrids);
        expect(loadFromLocalStorage).toHaveBeenCalledWith(1);
    });


    it('should handle saveInitialGrid when userId exists', () => {
        const stateWithUser: UserSaveGridsState = {
            ...initialState,
            userId: 1,
            savedGrids: {
                ...initialState.savedGrids,
                initial: {
                    ...initialState.savedGrids.initial,
                    name: 'initial',
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

        const result = userGridReducer(stateWithUser, saveInitialGrid('first grid'));

        expect(Object.keys(result.savedGrids)).toContain(mockNewLayoutId);
        expect(result.savedGrids[mockNewLayoutId]).toMatchObject({
            layoutId: mockNewLayoutId,
            config: stateWithUser.savedGrids.initial.config,
        });
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle deleteThisGrid with the given layoutId', () => {
        const stateWithUser = JSON.parse(JSON.stringify(initialState));
        stateWithUser.userId = 1;

        stateWithUser.savedGrids[mockNewLayoutId] = {
            layoutId: mockNewLayoutId,
            timestamp: '2023-01-01T00:00:00.000Z',
            name: 'mock grid',
            config: { ...stateWithUser.savedGrids.initial.config },
        };

        const result = userGridReducer(stateWithUser, deleteThisGrid(mockNewLayoutId));

        expect(result.savedGrids).not.toHaveProperty(mockNewLayoutId);
        expect(result.savedGrids).toHaveProperty('initial');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle updateGridConfig when userId and layoutId exist', () => {
        const stateWithUser: UserSaveGridsState = {
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

        const result = userGridReducer(
            stateWithUser,
            updateGridConfig({ layoutId: mockNewLayoutId, key: 'items', value: '99' }),
        );

        expect(result.savedGrids[mockNewLayoutId].config.items).toBe('99');
        expect(typeof result.savedGrids[mockNewLayoutId].timestamp).toBe('string');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle resetUserGrids', () => {
        const modifiedState: UserSaveGridsState = {
            userId: 1,
            savedGrids: {
                [mockNewLayoutId]: {
                    layoutId: mockNewLayoutId,
                    timestamp: '2023-01-01T00:00:00.000Z',
                    name: 'layout save',
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

        const action = resetUserGrids(); // Action-Creator
        const result = userGridReducer(modifiedState, action);

        // Prüfen, dass savedGrids auf die initialen Keys zurückgesetzt wurde
        const initialGridKeys = Object.keys(userGridInitialState.savedGrids);
        expect(Object.keys(result.savedGrids)).toEqual(initialGridKeys);

        const initialLayoutId = initialGridKeys[0];
        expect(result.savedGrids[initialLayoutId].layoutId).toBe(initialLayoutId);
        expect(result.savedGrids[initialLayoutId].config).toEqual(
            userGridInitialState.savedGrids[initialLayoutId].config
        );
        expect(result.savedGrids[initialLayoutId].name).toBe(
            userGridInitialState.savedGrids[initialLayoutId].name
        );

        // Prüfen, dass die localStorage helper aufegerufen wurden
        expect(clearUserGridsFromLocalStorage).toHaveBeenCalledWith(1);
        expect(saveToLocalStorage).toHaveBeenCalled();
    });


    it('should handle loadUserGrids and persist to localStorage', () => {
        const customState: UserSaveGridsState = {
            userId: 42,
            name: 'abc',
            savedGrids: {
                abc: {
                    layoutId: 'abc',
                    timestamp: '2023-01-01T00:00:00.000Z',
                    name: 'abc',
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
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle getGridsFromLocalStorage and load savedGrids', async () => {
        const mockSavedState: UserSaveGridsState = {
            userId: 1,
            name: 'test123',
            savedGrids: {
                test123: {
                    layoutId: 'test123',
                    timestamp: '2023-01-01T00:00:00.000Z',
                    name: 'test123',
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

        const result = userGridReducer(initialState, getGridsFromLocalStorage(1));

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockSavedState.savedGrids);
        expect(loadFromLocalStorage).toHaveBeenCalled();
    });
});
