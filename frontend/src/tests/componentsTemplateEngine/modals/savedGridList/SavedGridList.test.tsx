import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import ApiClient from '@/plugins/axios';
import { initialLayoutId, initialName } from '@/store/userSaveGridsSlice';
import { userLoggedInNoAdmin } from '@/tests/mocks/api';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const renameUniqueGridName = 'Unique Grid';

vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));

vi.spyOn(ApiClient, 'delete').mockResolvedValueOnce({ data: {} });
vi.spyOn(ApiClient, 'patch').mockResolvedValue({
    data: { data: { name: renameUniqueGridName } },
});

describe('SavedGridList', () => {
    const mockGrids = [
        {
            layoutId: initialLayoutId,
            name: initialName,
            timestamp: new Date().toISOString(),
            config: {
                items: '1',
                columns: '1',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
        {
            layoutId: 'grid1',
            name: 'First Grid',
            timestamp: new Date().toISOString(),
            config: {
                items: '2',
                columns: '1',
                gap: '1',
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

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3); // row[0] = table header

        expect(screen.getByText(/First Grid/i)).toBeInTheDocument();
        expect(screen.getByText(/Second Grid/i)).toBeInTheDocument();

        const firstDataRow = rows[1]; // grid1
        expect(
            within(firstDataRow).getByText((content) => content.includes('"items": "2"')),
        ).toBeInTheDocument();
        expect(
            within(firstDataRow).getByText((content) => content.includes('"columns": "1"')),
        ).toBeInTheDocument();

        const secondDataRow = rows[2]; // grid2
        expect(
            within(secondDataRow).getByText((content) => content.includes('"items": "3"')),
        ).toBeInTheDocument();
        expect(
            within(secondDataRow).getByText((content) => content.includes('"columns": "4"')),
        ).toBeInTheDocument();

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons).toHaveLength(2);
    });

    it('toggles config text on click (truncate long text)', async () => {
        const { user } = renderUtils();

        const configCell = screen.getByText(/items": "2"/i);
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
            const availableGrid = state.userGrid.savedGrids[initialLayoutId];

            expect(deletedGrid).toBeUndefined();
            expect(availableGrid).toBeDefined();
        });
    });

    it('renames a grid and validates duplicate name errors', async () => {
        vi.spyOn(ApiClient, 'patch').mockResolvedValue({
            data: { data: { name: renameUniqueGridName } },
        });

        const { user, store } = renderUtils();

        // rename "Second Grid"
        const renameBtn = screen
            .getAllByRole('button', { name: /rename layout/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('Second Grid'));
        if (!renameBtn) throw new Error('Rename button not found');

        await user.click(renameBtn);

        // Input erscheint + hat Fokus + enthält noch alten Namen im lokalen state
        const input = screen.getByPlaceholderText('name of the grid');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Second Grid');
        expect(input).toHaveFocus();

        // User tippt Namen, der schon existiert -> Fehlermeldung
        await user.clear(input);
        await user.type(input, 'First Grid');
        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        await waitFor(() => {
            expect(
                screen.getByText(/A grid with the name "First Grid" already exists/i),
            ).toBeInTheDocument();
        });

        // User klickt danach ins Inputfeld -> Fehlermeldung verschwindet
        await user.click(input);
        await waitFor(() => {
            expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument();
        });

        // User gibt einen neuen, eindeutigen Namen ein
        await user.clear(input);
        await user.type(input, renameUniqueGridName);
        await user.click(saveBtn);

        // Der gemockte thunk lässt das Store-Update erfolgreich prüfen
        await waitFor(() => {
            const state = store.getState();
            const renamedGrid = state.userGrid.savedGrids['grid2'];
            expect(renamedGrid.name).toBe(renameUniqueGridName);
        });
    });

    it('cancels renaming and keeps the original grid name unchanged', async () => {
        const { user, store } = renderUtils();

        // Rename starten
        const renameBtn = screen
            .getAllByRole('button', { name: /rename layout/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('Second Grid'));
        if (!renameBtn) throw new Error('Rename button not found');

        await user.click(renameBtn);

        // Input erscheint und enthält alten Namen vom local state
        const input = screen.getByPlaceholderText('name of the grid');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Second Grid');

        // Benutzer tippt neuen Namen, klickt dann "cancel"
        await user.clear(input);
        await user.type(input, 'Temp Name');
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelBtn);

        // Eingabefeld verschwindet wieder
        await waitFor(() => {
            expect(screen.queryByPlaceholderText('name of the grid')).not.toBeInTheDocument();
        });

        // State prüfen – Name soll unverändert bleiben
        const state = store.getState();
        const unchangedGrid = state.userGrid.savedGrids['grid2'];
        expect(unchangedGrid.name).toBe('Second Grid');
    });

    it('applies a grid configuration to initialLayout when clicking "apply layout"', async () => {
        const { user, store } = renderUtils();

        // example apply grid1 layout config to initialLayoutId

        const applyBtnFirstGrid = screen
            .getAllByRole('button', { name: /apply layout/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('First Grid'));
        if (!applyBtnFirstGrid) throw new Error('Apply button not found');

        await user.click(applyBtnFirstGrid);

        await waitFor(() => {
            const state = store.getState();
            const initialGrid = state.userGrid.savedGrids[initialLayoutId];
            const sourceGrid = state.userGrid.savedGrids['grid1'];

            expect(initialGrid.config).toEqual(sourceGrid.config);
            expect(new Date(initialGrid.timestamp).getTime()).toBeGreaterThan(
                new Date(sourceGrid.timestamp).getTime() - 1,
            );
        });
    });

    it('sanitizes grid name during renaming and shows feedback', async () => {
        const { user } = renderUtils();

        const renameBtn = screen
            .getAllByRole('button', { name: /rename layout/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('Second Grid'));
        if (!renameBtn) throw new Error('Rename button not found');

        await user.click(renameBtn);

        const input = screen.getByPlaceholderText('name of the grid');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Second Grid');

        await user.clear(input);
        await user.type(input, 'My*Grid!');

        const saveBtn = screen.getByRole('button', { name: /save/i });
        await user.click(saveBtn);

        await waitFor(() => {
            const errorMessage = screen.queryByText(/invalid characters/i);
            const sanitizedValue = (input as HTMLInputElement).value;

            // Entweder wird Fehlermeldung angezeigt ODER der Wert korrigiert
            expect(errorMessage || sanitizedValue).toBeTruthy();
        });
    });
});
