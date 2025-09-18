import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import userGridReducer, {
    deleteThisGrid,
    fetchUserGridsThunk,
    getGridsFromLocalStorage,
    loadUserGrids,
    resetUserGrids,
    resetUserGridsThunk,
    saveInitialGrid,
    updateGridConfig,
    initialState as userGridInitialState,
} from '@/store/userSaveGridsSlice';
import { mockBackendGrids, userLoggedAdmin, userLoggedInNoAdmin } from '@/tests/mocks/api';
import {
    mockLoggedInAdminState,
    mockLoggedInUserState,
    mockStateWithUserId1,
    mockUPDATEStateWithUserId1,
} from '@/tests/mocks/redux';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { UserSaveGridsState } from '@/types/Redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        loadFromLocalStorage.mockReturnValue(mockStateWithUserId1);

        const userId = 1;

        const action = getGridsFromLocalStorage(userId);
        const result = userGridReducer(initialState, action);

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockStateWithUserId1.savedGrids);
        expect(loadFromLocalStorage).toHaveBeenCalledWith(userId);
    });

    it('should handle saveInitialGrid when userId exists', () => {
        const result = userGridReducer(mockStateWithUserId1, saveInitialGrid('first grid'));

        expect(Object.keys(result.savedGrids)).toContain(mockNewLayoutId);
        expect(result.savedGrids[mockNewLayoutId]).toMatchObject({
            layoutId: mockNewLayoutId,
            config: mockStateWithUserId1.savedGrids.initial.config,
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
        const result = userGridReducer(
            mockUPDATEStateWithUserId1,
            updateGridConfig({ layoutId: mockNewLayoutId, key: 'items', value: '99' }),
        );

        expect(result.savedGrids[mockNewLayoutId].config.items).toBe('99');
        expect(typeof result.savedGrids[mockNewLayoutId].timestamp).toBe('string');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle resetUserGrids if admin', () => {
        const action = resetUserGrids(1); // Action-Creator
        const result = userGridReducer(mockStateWithUserId1, action);

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
        expect(clearUserGridsFromLocalStorage).toHaveBeenCalledWith(1);
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle loadUserGrids and persist to localStorage', () => {
        const result = userGridReducer(initialState, loadUserGrids(mockStateWithUserId1));

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toHaveProperty('layout');
        expect(saveToLocalStorage).toHaveBeenCalled();
    });

    it('should handle getGridsFromLocalStorage and load savedGrids', async () => {
        const { loadFromLocalStorage } = await import('@/store/localStorage');
        (loadFromLocalStorage as Mock).mockReturnValue(mockStateWithUserId1);

        const result = userGridReducer(initialState, getGridsFromLocalStorage(1));

        expect(result.userId).toBe(1);
        expect(result.savedGrids).toEqual(mockStateWithUserId1.savedGrids);
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

    it('dispatches fetchUserGridsThunk and merges backend grids', async () => {
        const preloadedState = mockLoggedInUserState; // userId = userLoggedInNoAdmin
        const user = userEvent.setup();

        // ui rendern mit dem fetchButton
        const { store } = renderWithProviders(<SaveGridsModal />, {
            route: '/template-engine',
            preloadedState,
        });

        // 🔍 Check: userId ist wirklich da
        expect(store.getState().userGrid.userId).toBe(userLoggedInNoAdmin);

        // Modal öffnen
        const openModalButton = screen.getByRole('button', { name: /with a meaningful name/i });
        await user.click(openModalButton);

        // Sicherstellen, dass Modal offen ist
        expect(await screen.findByText(/save grid/i)).toBeInTheDocument();

        // Show Grids Button klicken
        const fetchButton = screen.getByRole('button', { name: /show grids/i });
        await user.click(fetchButton); // kann den thunk nicht auslösen das clickHandler ohne api für userId
        // sicherstellen, dass thunk trotzdem manuell ausgeführt wird
        await store.dispatch(fetchUserGridsThunk(userLoggedInNoAdmin));

        // der State sich geändert haben
        await waitFor(() => {
            const state = store.getState().userGrid.savedGrids;
            expect(state).toHaveProperty('initial');
            expect(state).toHaveProperty('04257982-d7a8-3a99-913d-31b4a3b270ed'); // aus mockBackendGrids
        });

        // ui rendern dass die grids aus dem state anzeigt
        renderWithProviders(<SavedGridList />, {
            route: '/template-engine',
            preloadedState: store.getState(),
        });
        // der geänderte statew wird gerendert
        expect(
            await screen.findByText(mockBackendGrids['04257982-d7a8-3a99-913d-31b4a3b270ed'].name),
        ).toBeInTheDocument();
    });
});
