import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import ApiClient from '@/plugins/axios';
import { userLoggedInNoAdmin } from '@/tests/mocks/api';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.spyOn(ApiClient, 'delete').mockResolvedValueOnce({ data: {} });

describe('SavedGridList', () => {
    const mockGrids = [
        {
            layoutId: 'initial',
            name: 'First Grid',
            timestamp: new Date().toISOString(),
            config: {
                items: '1',
                columns: '2',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
        {
            layoutId: 'grid2',
            name: 'Second Grid',
            timestamp: new Date().toISOString(),
            config: {
                items: '3',
                columns: '4',
                gap: '1',
                border: '1',
                paddingX: '2',
                paddingY: '2',
            },
        },
    ];

    const renderUtils = (savedGrids: typeof mockGrids = mockGrids) => {
        const user = userEvent.setup();

        const preloadedState = {
            login: {
                userId: userLoggedInNoAdmin,
                isLoggedIn: true,
                isLoading: false,
                error: null,
            },
            userGrid: {
                userId: userLoggedInNoAdmin,
                savedGrids: Object.fromEntries(savedGrids.map((g) => [g.layoutId, g])),
            },
        };

        const { store } = renderWithProviders(<SavedGridList />, { preloadedState });

        return {
            store,
            user,
        };
    };

    it('renders "No grids saved yet" when there are no grids', () => {
        // pass no grids
        renderUtils([]);
        expect(screen.getByText(/No grids saved yet/i)).toBeInTheDocument();
    });

    it('renders a list of saved grids', () => {
        renderUtils();

        expect(screen.getByText(/Your Saved Grids:/i)).toBeInTheDocument();
        expect(screen.getByText(/First Grid/i)).toBeInTheDocument();
        expect(screen.getByText(/Second Grid/i)).toBeInTheDocument();

        expect(screen.getByText(/items": "1"/i)).toBeInTheDocument();
        expect(screen.getByText(/columns": "4"/i)).toBeInTheDocument();

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons).toHaveLength(2);
    });

    it('toggles config text on click (truncate long text)', async () => {
        const { user } = renderUtils();

        const configCell = screen.getByText(/items": "1"/i);
        expect(configCell).toHaveClass('truncate');

        await user.click(configCell);
        expect(configCell).not.toHaveClass('truncate');

        await user.click(configCell);
        expect(configCell).toHaveClass('truncate');
    });

    it('opens a confirmation dialog: confirm or cancel a delete action', async () => {
        const { user } = renderUtils();

        const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
        await user.click(deleteBtn);

        expect(screen.getByTitle(/Yes, delete/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Cancel/i)).toBeInTheDocument();

        await user.click(screen.getByTitle(/Cancel/i));
        expect(screen.queryByTitle(/Yes, delete/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle(/Cancel/i)).not.toBeInTheDocument();
    });

    it('confirms delete and dispatches deleteThisGrid for a deletable grid', async () => {
        const { user, store } = renderUtils();

        vi.spyOn(ApiClient, 'delete').mockResolvedValueOnce({ data: {} });

        const nameOfTheGrid = 'Second Grid';

        const deleteBtn = screen
            .getAllByRole('button', { name: /delete/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes(nameOfTheGrid));
        if (!deleteBtn) throw new Error('Delete button not found');

        await user.click(deleteBtn);

        const confirmBtn = screen.getByTitle(/Yes, delete/i);
        await user.click(confirmBtn);

        await waitFor(() => {
            const state = store.getState();
            const deletedGrid = state.userGrid.savedGrids['grid2'];
            const availableGrid = state.userGrid.savedGrids['initial'];

            expect(deletedGrid).toBeUndefined();
            expect(availableGrid).toBeDefined();
        });
    });
});
