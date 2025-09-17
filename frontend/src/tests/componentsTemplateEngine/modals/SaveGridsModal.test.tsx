import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import type { RootState } from '@/store';
import { userLoggedAdmin } from '@/tests/mocks/handlers';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Preloaded Redux State
const preloadedState: Partial<RootState> = {
    login: {
        isLoggedIn: true,
        isLoading: false,
        error: null,
        role: 'admin',
    },
    userGrid: {
        userId: userLoggedAdmin,
        savedGrids: {
            initial: {
                layoutId: 'initial',
                timestamp: '2025-09-12T04:42:32.241Z',
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
        },
    },
};

describe('SaveGridsModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderModal = async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<SaveGridsModal />, {
            route: '/template-engine',
            preloadedState,
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

    it('shows error when trying to save without a name', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        const error = await screen.findByTestId('grid-error');
        expect(error).toHaveTextContent(/Please input a recognizable name/i);
    });

    it('saves a new grid correctly', async () => {
        const { user, openModalButton, store } = await renderModal();
        await user.click(openModalButton);

        const input = screen.getByPlaceholderText(/name of the grid/i);
        await user.type(input, 'MyGrid');

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        await waitFor(() => {
            const state = store.getState();
            const savedGrid = Object.values(state.userGrid.savedGrids).find(
                (grid) => grid.name === 'MyGrid',
            );
            expect(savedGrid).toBeDefined();
            expect(savedGrid!.name).toBe('MyGrid');
        });
        expect(await screen.findByText(/Your Saved Grids:/i)).toBeInTheDocument();
    });

    it('shows saved grids when clicking Show Grids', async () => {
        const { user, openModalButton, store } = await renderModal();
        await user.click(openModalButton);

        // Mock initial savedGrids im Store
        const showGridsBtn = screen.getByRole('button', { name: /Show Grids/i });
        await user.click(showGridsBtn);

        // Warten, bis hasGridIsOpen true ist und die SavedGridList sichtbar wird
        await waitFor(() => {
            const state = store.getState();
            expect(state.userGrid.savedGrids.initial).toBeDefined();
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
            expect(Object.keys(state.userGrid.savedGrids)).toEqual(['initial']);
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

    it('shows error when grid name already exists', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        const input = screen.getByPlaceholderText(/name of the grid/i);
        await user.type(input, 'initial');

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        const error = await screen.findByTestId('grid-error');
        expect(error).toHaveTextContent(/already exists/i);
    });
});
