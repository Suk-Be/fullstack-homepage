import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import { store } from '@/store';
import { saveToLocalStorage } from '@/store/localStorage';
import { initialGridConfig, initialLayoutId, initialName } from '@/store/userSaveGridsSlice';
import { userLoggedAdmin } from '@/tests/mocks/api';
import { mockGuestUserState, mockLoggedInAdminState } from '@/tests/mocks/redux';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Spy/Resolver für den Test
let resolveSave: Function;
let resolveFetch: Function;

vi.mock('@/store/thunks/userSaveGridsThunks', async () => {
    const { createAsyncThunk } = await import('@reduxjs/toolkit');

    const saveUserGridThunk = createAsyncThunk<number, void>(
        'userGrids/saveUserGrid',
        async () =>
            new Promise((resolve) => {
                resolveSave = resolve;
            }),
    );
    const fetchUserGridsThunk = createAsyncThunk<Record<string, any>, number>(
        'userGrids/fetchUserGrids',
        async () =>
            new Promise((resolve) => {
                resolveFetch = resolve;
            }),
    );

    const resetUserGridsThunk = createAsyncThunk<number, number>(
        'userGrids/resetUserGrids',
        async (userId = userLoggedAdmin) => userId,
    );
    const deleteThisGridThunk = createAsyncThunk<number, number>(
        'userGrids/deleteThisGrid',
        async (gridId) => gridId,
    );

    const renameThisGridThunk = createAsyncThunk<number, void>(
        'userGrids/renameThisGrid',
        async () => 0,
    );

    return {
        resetUserGridsThunk,
        deleteThisGridThunk,
        fetchUserGridsThunk,
        saveUserGridThunk,
        renameThisGridThunk,
    };
});

// Axios Mock
vi.mock('@/plugins/axios', () => {
    return {
        default: {
            post: vi.fn().mockResolvedValue({
                data: {
                    data: {
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
                    },
                },
            }),
        },
    };
});

describe('SaveGridsModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear(); // sauberer Start

        saveToLocalStorage(userLoggedAdmin, {
            userId: userLoggedAdmin,
            savedGrids: {
                [initialLayoutId]: {
                    layoutId: initialLayoutId,
                    timestamp: new Date().toISOString(),
                    name: initialName,
                    config: initialGridConfig,
                },
            },
        });
    });

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });
    afterAll(() => {
        vi.restoreAllMocks();
    });

    const renderModal = async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<SaveGridsModal />, {
            route: '/template-engine',
            preloadedState: mockLoggedInAdminState,
        });

        const openModalButton = screen.getByRole('button', {
            name: /with a meaningful name/i,
        });

        return { user, openModalButton, store };
    };

    it('renders a dialog open button', async () => {
        const { openModalButton } = await renderModal();
        expect(openModalButton).toBeInTheDocument();
    });

    it('opens and closes the modal', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        const dialog = await screen.findByTestId('dialog-markup');
        expect(dialog).toBeVisible();

        await user.click(screen.getByLabelText(/Close modal/i));
        await waitFor(() => expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument());
    });

    it('focuses input automatically when modal opens', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        const input = await screen.findByPlaceholderText(/name of the grid/i);
        await waitFor(() => expect(input).toHaveFocus());
    });

    it('shows saved grids when clicking Show Grids', async () => {
        const { user, openModalButton, store } = await renderModal();
        await user.click(openModalButton);

        const showGridsBtn = screen.getByRole('button', { name: /Show Grids/i });
        await user.click(showGridsBtn);

        await waitFor(() => {
            const state = store.getState();
            expect(state.userGrid.savedGrids.initialLayoutId).toBeDefined();
        });
    });

    it('resets grids for admin user', async () => {
        const { user, openModalButton, store } = await renderModal();
        await user.click(openModalButton);

        const resetBtn = screen.getByRole('button', { name: /reset/i });

        await user.click(resetBtn);

        // Warten, bis der resetThunk abgeschlossen ist
        await waitFor(() => {
            const state = store.getState();
            // Der "initial" Key bleibt bestehen, alles andere gelöscht
            expect(Object.keys(state.userGrid.savedGrids)).toEqual(['initialLayoutId']);
        });
    });

    it('shows no reset button for users with no admin role', () => {
        renderWithProviders(<SaveGridsModal />, {
            route: '/template-engine',
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    isLoading: false,
                    error: null,
                    role: 'user',
                },
            },
        });

        const resetBtn = screen.queryByRole('button', { name: /reset/i });

        expect(resetBtn).not.toBeInTheDocument();
    });

    it('calls hasValidUser and shows error if no userId', async () => {
        renderWithProviders(<SaveGridsModal />, {
            preloadedState: mockGuestUserState,
        });

        const openModalButton = screen.getByRole('button', {
            name: /with a meaningful name/i,
        });
        await userEvent.click(openModalButton);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await userEvent.click(saveBtn);

        expect(await screen.findByTestId('grid-error')).toHaveTextContent(/User not logged in/i);
    });

    it('calls isNameUnique and shows error if name empty', async () => {
        renderWithProviders(<SaveGridsModal />, {
            preloadedState: mockLoggedInAdminState,
        });

        const openModalButton = screen.getByRole('button', {
            name: /with a meaningful name/i,
        });
        await userEvent.click(openModalButton);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await userEvent.click(saveBtn);

        expect(await screen.findByTestId('grid-error')).toHaveTextContent(
            /Please input a recognizable name./i,
        );
    });

    it('dispatches saveUserGridThunk and updates state', async () => {
        const { user, openModalButton, store } = await renderModal();

        // Modal öffnen und Name tippen
        await user.click(openModalButton);
        const input = screen.getByPlaceholderText(/name of the grid/i);
        await user.type(input, 'MyUniqueGrid');
        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        // Dispatchen des Fulfilled Actions (simuliert)
        await act(async () => {
            store.dispatch({
                type: 'userGrids/saveUserGrid/fulfilled',
                payload: {
                    layoutId: 'my-grid-id',
                    name: 'MyUniqueGrid',
                    config: {},
                    timestamp: new Date().toISOString(),
                },
            });
        });

        await waitFor(() => {
            const state = store.getState();
            const savedGrid = Object.values(state.userGrid.savedGrids).find(
                (g) => g.name === 'MyUniqueGrid',
            );
            expect(savedGrid).toBeDefined();
        });
    });

    it('sanitizes grid name and shows feedback if invalid characters are removed', async () => {
        const { user, openModalButton } = await renderModal();
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        await user.click(openModalButton);

        const input = await screen.findByPlaceholderText(/name of the grid/i);
        const saveBtn = screen.getByRole('button', { name: /save/i });

        const dirtyName = '<script>alert(1)</script>MyGrid@';
        await user.clear(input);
        await user.type(input, dirtyName);

        await user.click(saveBtn);

        await waitFor(() => {
            expect(
                screen.getByText(/Some special characters were automatically removed/i),
            ).toBeInTheDocument();
        });

        expect((input as HTMLInputElement).value).toBe('MyGrid@');
        expect(dispatchSpy).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: 'userGrids/saveUserGrid/pending' }),
        );
    });

    it('shows LoadingSkeleton when fetching grids', async () => {
        const { user, openModalButton } = await renderModal();

        await user.click(openModalButton);

        const showGridsBtn = screen.getByRole('button', { name: /Show Grids/i });

        await user.click(showGridsBtn);

        const skeletons = await screen.findAllByTestId('loading-skeleton');
        expect(skeletons).toHaveLength(4);

        await act(async () =>
            resolveFetch?.({
                'grid-1': {
                    layoutId: 'grid-1',
                    timestamp: new Date().toISOString(),
                    name: 'MyGrid1',
                    config: {
                        items: '1',
                        columns: '1',
                        gap: '0',
                        border: '0',
                        paddingX: '0',
                        paddingY: '0',
                    },
                },
            }),
        );

        await waitFor(() =>
            expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument(),
        );
    });

    it('shows LoadingSkeleton when saving a grid', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        const input = screen.getByPlaceholderText(/name of the grid/i);
        await user.type(input, 'MyUniqueGrid');

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(4);

        await act(async () => resolveSave?.({}));

        await waitFor(() =>
            expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument(),
        );
    });
});
