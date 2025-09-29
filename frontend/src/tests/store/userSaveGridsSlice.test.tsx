import { selectGridsFromThisUser } from '@/store/selectors/userGridSelectors';
import { fetchUserGridsThunk, resetUserGridsThunk } from '@/store/thunks/userSaveGridsThunks';
import userGridReducer, {
    createGrid,
    deleteThisGrid,
    getGridsFromLocalStorage,
    initialLayoutId,
    loadUserGrids,
    resetUserGrids,
    saveGrid,
    updateGridConfig,
    initialState as userGridInitialState,
} from '@/store/userSaveGridsSlice';
import { userLoggedAdmin, userLoggedInNoAdmin } from '@/tests/mocks/api';
import {
    mockLoggedInAdminState,
    mockLoggedInUserState,
    mockStateWithAdmin,
    mockUPDATEStateWithAdmin,
} from '@/tests/mocks/redux';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
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

    it('should handle getGridsFromLocalStorage for current user', () => {
        loadFromLocalStorage.mockReturnValue(mockStateWithAdmin);

        const userId = 1;

        const action = getGridsFromLocalStorage(userId);
        const result = userGridReducer(initialState, action);

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockStateWithAdmin.savedGrids);
        expect(loadFromLocalStorage).toHaveBeenCalledWith(userId);
    });

    it('should create a new grid object with the given base config', () => {
        const baseConfig = mockStateWithAdmin.savedGrids[initialLayoutId].config;
        const newGrid = createGrid(baseConfig, 'first grid');

        expect(newGrid).toMatchObject({
            layoutId: mockNewLayoutId, // mocked uuid
            config: baseConfig,
            name: 'first grid',
        });
        expect(typeof newGrid.timestamp).toBe('string');
    });

    it('should handle saveGrid reducer when userId exists', () => {
        const state = { ...mockStateWithAdmin };
        const action = saveGrid('first grid'); // Action-Payload = Name
        const result = userGridReducer(state, action);

        // Prüfen, dass das neue Grid im savedGrids Objekt existiert
        expect(result.savedGrids).toHaveProperty(mockNewLayoutId);
        expect(result.savedGrids[mockNewLayoutId]).toMatchObject({
            config: state.savedGrids.initialLayoutId.config,
            name: 'first grid',
        });
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle deleteThisGrid with the given layoutId', () => {
        const state = {
            ...initialState,
            userId: 1,
            savedGrids: {
                ...initialState.savedGrids,
                [mockNewLayoutId]: {
                    layoutId: mockNewLayoutId,
                    timestamp: '2023-01-01T00:00:00.000Z',
                    name: 'mock grid',
                    config: { ...initialState.savedGrids.initialLayoutId.config },
                },
            },
        };

        const result = userGridReducer(state, deleteThisGrid(mockNewLayoutId));

        expect(result.savedGrids).not.toHaveProperty(mockNewLayoutId);
        expect(result.savedGrids).toHaveProperty(initialLayoutId); // bleibt immer erhalten
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle updateGridConfig when userId and layoutId exist', () => {
        const result = userGridReducer(
            mockUPDATEStateWithAdmin,
            updateGridConfig({ layoutId: mockNewLayoutId, key: 'items', value: '99' }),
        );

        expect(result.savedGrids[mockNewLayoutId].config.items).toBe('99');
        expect(typeof result.savedGrids[mockNewLayoutId].timestamp).toBe('string');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle resetUserGrids if admin', () => {
        const action = resetUserGrids(userLoggedAdmin); // Action-Creator
        const result = userGridReducer(mockStateWithAdmin, action);

        // Prüfen, dass savedGrids auf die initialen Keys zurückgesetzt wurde
        const initialGridKeys = Object.keys(userGridInitialState.savedGrids);
        expect(Object.keys(result.savedGrids)).toEqual(initialGridKeys);

        const initialLayoutId = initialGridKeys[0];
        expect(result.savedGrids[initialLayoutId].layoutId).toBe(initialLayoutId);
        expect(result.savedGrids[initialLayoutId].config).toEqual(
            userGridInitialState.savedGrids[initialLayoutId].config,
        );
        expect(result.savedGrids[initialLayoutId].name).toBe(
            userGridInitialState.savedGrids[initialLayoutId].name,
        );

        // Prüfen, dass die localStorage helper aufegerufen wurden
        expect(clearUserGridsFromLocalStorage).toHaveBeenCalledWith(userLoggedAdmin);
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle loadUserGrids and persist to localStorage', () => {
        const result = userGridReducer(initialState, loadUserGrids(mockStateWithAdmin));

        expect(result.userId).toBe(userLoggedAdmin);
        expect(result.savedGrids).toHaveProperty('layout');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle getGridsFromLocalStorage and load savedGrids', async () => {
        const { loadFromLocalStorage } = await import('@/store/localStorage');
        (loadFromLocalStorage as Mock).mockReturnValue(mockStateWithAdmin);

        const result = userGridReducer(initialState, getGridsFromLocalStorage(userLoggedAdmin));

        expect(result.userId).toBe(userLoggedAdmin);
        expect(result.savedGrids).toEqual(mockStateWithAdmin.savedGrids);
        expect(loadFromLocalStorage).toHaveBeenCalled();
    });

    it('fulfills when userId is admin', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        const result = await resetUserGridsThunk(userLoggedAdmin)(dispatch, getState, undefined);

        expect(result.type).toBe('userGrids/resetUserGrids/fulfilled');
        expect(result.payload).toBe(userLoggedAdmin);
    });

    it('rejects when userId is not admin', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        const result = await resetUserGridsThunk(userLoggedInNoAdmin)(
            dispatch,
            getState,
            undefined,
        );

        expect(result.type).toBe('userGrids/resetUserGrids/rejected');
        expect(result.payload).toBe('Authorization Failed');
    });

    it('dispatches fetchUserGridsThunk and updates state', async () => {
        const { store } = renderWithProviders(<div />, {
            preloadedState: mockLoggedInAdminState,
        });

        await store.dispatch(fetchUserGridsThunk(123));

        expect(store.getState().userGrid.savedGrids).toHaveProperty(
            '04257982-d7a8-3a99-913d-31b4a3b270ed',
        );
    });

    it('fetchUserGridsThunk merges backend grids', async () => {
        const { store } = renderWithProviders(<div />, {
            preloadedState: mockLoggedInUserState,
        });

        await store.dispatch(fetchUserGridsThunk(userLoggedInNoAdmin));

        const state = store.getState().userGrid.savedGrids;
        expect(state).toHaveProperty(initialLayoutId); // initialId bleibt
        expect(state).toHaveProperty('04257982-d7a8-3a99-913d-31b4a3b270ed'); // aus mockBackendGrids
    });

    it('selectGridsFromThisUser returns the savedGrids object', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = selectGridsFromThisUser(mockLoggedInUserState as any);

        expect(typeof result).toBe('object');
        expect(result).toHaveProperty(initialLayoutId);
    });
});
