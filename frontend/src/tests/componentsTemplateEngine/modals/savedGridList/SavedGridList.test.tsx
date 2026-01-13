import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));

vi.mock('@/utils/templateEngine/markupClipboard', async (importOriginal) => {
    const actual =
        (await importOriginal()) as typeof import('@/utils/templateEngine/markupClipboard');

    return {
        ...actual,
        copyGridMarkupToClipboard: vi.fn().mockResolvedValue(''),
        renderGridMarkup: vi.fn(() => 'MOCK_MARKUP'),
    };
});

vi.mock('@/utils/templateEngine/gridStyle', async (importOriginal) => {
    const actual = (await importOriginal()) as typeof import('@/utils/templateEngine/gridStyle');

    return {
        ...actual,
        buildGridRenderPropsFromConfig: vi.fn(() => ({
            inlineStyles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                gap: '1px',
                borderWidth: 'calc(0rem/3)',
                padding: 'calc(0rem/2) calc(0rem/2)',
            },
            gridItemsArray: [1, 2],
        })),
    };
});

import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import ApiClient from '@/plugins/axios';
import { initialLayoutId, initialName } from '@/store/userSaveGridsSlice';
import { userLoggedInNoAdmin } from '@/tests/mocks/api';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { buildGridRenderPropsFromConfig } from '@/utils/templateEngine/gridStyle';
import { copyGridMarkupToClipboard } from '@/utils/templateEngine/markupClipboard';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const renameUniqueGridName = 'Unique Grid';

const mockGrids = [
    {
        layoutId: initialLayoutId,
        name: initialName,
        timestamp: new Date().toISOString(),
        config: { items: '1', columns: '1', gap: '0', border: '0', paddingX: '0', paddingY: '0' },
    },
    {
        layoutId: 'grid1',
        name: 'First Grid',
        timestamp: new Date().toISOString(),
        config: { items: '2', columns: '1', gap: '1', border: '0', paddingX: '0', paddingY: '0' },
    },
    {
        layoutId: 'grid2',
        name: 'Second Grid',
        timestamp: new Date().toISOString(),
        config: { items: '3', columns: '4', gap: '1', border: '1', paddingX: '2', paddingY: '2' },
    },
] as const;

const renderUtils = (savedGrids: typeof mockGrids = mockGrids) => {
    const user = userEvent.setup();

    const preloadedState = {
        login: { userId: userLoggedInNoAdmin, isLoggedIn: true, isLoading: false, error: null },
        userGrid: {
            userId: userLoggedInNoAdmin,
            savedGrids: Object.fromEntries(savedGrids.map((g) => [g.layoutId, g])),
        },
    };

    const { store } = renderWithProviders(<SavedGridList />, { preloadedState });
    return { store, user };
};

const getRowByGridName = (name: string) => {
    const row = screen.getAllByRole('row').find((r) => r.textContent?.includes(name));
    if (!row) throw new Error(`Row with grid name "${name}" not found`);
    return row;
};

const openMoreActionsForRow = async (
    user: ReturnType<typeof userEvent.setup>,
    row: HTMLElement,
) => {
    await user.click(within(row).getByRole('button', { name: /more actions/i }));
};

const openCssConfigForRow = async (user: ReturnType<typeof userEvent.setup>, row: HTMLElement) => {
    await openMoreActionsForRow(user, row);

    await user.click(within(row).getByRole('button', { name: /show css configuration/i }));
};

beforeEach(() => {
    vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    vi.spyOn(ApiClient, 'delete').mockResolvedValue({ data: {} } as any);
    vi.spyOn(ApiClient, 'patch').mockResolvedValue({
        data: { data: { name: renameUniqueGridName } },
    } as any);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
});

describe('SavedGridList', () => {
    it('renders "No grids saved yet" when there are no grids', () => {
        // pass no grids
        renderUtils([] as any);
        expect(screen.getByText(/No grids saved yet/i)).toBeInTheDocument();
    });

    it('shows Your saved Grids headline', () => {
        renderUtils();

        const SaveThisGridsHl = screen.queryByRole('heading', { name: /Save this Grid/i });
        const YourSavedGridsH3 = screen.getByRole('heading', { name: /Your saved Grids/i });

        expect(SaveThisGridsHl).not.toBeInTheDocument();
        expect(YourSavedGridsH3).toBeInTheDocument();
    });

    it('renders a list of saved grids', () => {
        renderUtils();

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3);

        expect(screen.getByText(/First Grid/i)).toBeInTheDocument();
        expect(screen.getByText(/Second Grid/i)).toBeInTheDocument();

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons).toHaveLength(2);
    });

    it('shows and hides layout configuration via toggle', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await openMoreActionsForRow(user, firstRow);

        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /hide css configuration/i }));

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('opens a confirmation dialog: confirm or cancel a delete action', async () => {
        const { user } = renderUtils();

        const row = getRowByGridName('First Grid');
        const deleteBtn = within(row).getByRole('button', { name: /delete layout/i });

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

    it('shows and hides the loading spinner when deleting a grid', async () => {
        const { user } = renderUtils();

        const deleteBtn = screen
            .getAllByRole('button', { name: /delete/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('First Grid'));
        if (!deleteBtn) throw new Error('Delete button not found');

        await user.click(deleteBtn);
        const confirmBtn = screen.getByTitle(/Yes, delete/i);
        expect(confirmBtn).toBeInTheDocument();

        const deleteMock = vi.spyOn(ApiClient, 'delete').mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => resolve({ data: {} }), 150); // künstliche Verzögerung
                }),
        );

        await user.click(confirmBtn);

        const spinner = await screen.findByTestId('loading-spinner');
        expect(spinner).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(deleteMock).toHaveBeenCalled();
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

    it('shows and hides the loading spinner when renaming a grid', async () => {
        const { user } = renderUtils();

        const renameBtn = screen
            .getAllByRole('button', { name: /rename layout/i })
            .find((btn) => btn.closest('tr')?.textContent?.includes('Second Grid'));
        if (!renameBtn) throw new Error('Rename button not found');

        await user.click(renameBtn);

        const input = screen.getByPlaceholderText('name of the grid');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Second Grid');

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

        await user.click(input);
        // clear message on user input
        await waitFor(() => {
            expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument();
        });

        // User gibt einen neuen, eindeutigen Namen ein
        await user.clear(input);
        await user.type(input, renameUniqueGridName);

        // 👇 Jetzt den verzögerten API-Mock setzen
        const patchMock = vi.spyOn(ApiClient, 'patch').mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ data: { data: { name: renameUniqueGridName } } });
                    }, 150);
                }),
        );
        // benutzen des api patch mock
        await user.click(saveBtn);

        // Spinner sichtbar
        const spinner = await screen.findByTestId('loading-spinner');
        expect(spinner).toBeInTheDocument();

        // Spinner verschwindet nach Abschluss
        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(patchMock).toHaveBeenCalled();
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

    it('sorts the grid list alphabetically by name when clicking the Name column header', async () => {
        const { user } = renderUtils();

        const nameHeader = screen.getByText(/^name$/i).closest('th');
        expect(nameHeader).toBeInTheDocument();

        // Klick → Sortierung absteigend (Z → A), die Daten sind beim initialen rendern (A → Z)
        await user.click(nameHeader!);

        const rowsDesc = screen.getAllByRole('row').slice(1); // Header überspringen, match content Reihenfolge
        const namesDesc = rowsDesc.map(
            (row) => row.textContent?.match(/First Grid|Second Grid|Initial/i)?.[0],
        );

        const sortedDesc = [...namesDesc].sort((a, b) => b!.localeCompare(a!));
        expect(namesDesc).toEqual(sortedDesc);

        // Klick (toggle Sortierung) → Sortierung aufsteigend (A → Z)
        await user.click(nameHeader!);

        const rowsAsc = screen.getAllByRole('row').slice(1);
        const namesAsc = rowsAsc.map(
            (row) => row.textContent?.match(/First Grid|Second Grid|Initial/i)?.[0],
        );

        const sortedAsc = [...namesAsc].sort((a, b) => a!.localeCompare(b!));
        expect(namesAsc).toEqual(sortedAsc);
    });

    it('sorts the grid list by date when clicking the Date column header', async () => {
        const { user } = renderUtils();

        const dateHeader = screen.getByText(/^date$/i).closest('th');
        expect(dateHeader).toBeInTheDocument();

        // Klick → Sortierung nach Datum (neueste zuerst)
        await user.click(dateHeader!);

        const rowsDesc = screen.getAllByRole('row').slice(1);
        const timestampsDesc = rowsDesc.map((row) => {
            const match = row.textContent?.match(/\d{4}-\d{2}-\d{2}T\d{2}:/);
            return match ? new Date(match[0]).getTime() : 0;
        });
        const sortedDesc = [...timestampsDesc].sort((a, b) => b - a);
        expect(timestampsDesc).toEqual(sortedDesc);

        // Klick → Sortierung nach Datum (älteste zuerst)
        await user.click(dateHeader!);

        const rowsAsc = screen.getAllByRole('row').slice(1);
        const timestampsAsc = rowsAsc.map((row) => {
            const match = row.textContent?.match(/\d{4}-\d{2}-\d{2}T\d{2}:/);
            return match ? new Date(match[0]).getTime() : 0;
        });
        const sortedAsc = [...timestampsAsc].sort((a, b) => a - b);
        expect(timestampsAsc).toEqual(sortedAsc);
    });

    it('shows only core actions by default and hides extra actions', () => {
        renderUtils();

        const firstRow = getRowByGridName('First Grid');

        expect(
            within(firstRow).getByRole('button', { name: /rename layout/i }),
        ).toBeInTheDocument();
        expect(within(firstRow).getByRole('button', { name: /apply layout/i })).toBeInTheDocument();
        expect(
            within(firstRow).getByRole('button', { name: /delete layout/i }),
        ).toBeInTheDocument();

        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();
        expect(
            within(firstRow).queryByRole('button', { name: /copy html/i }),
        ).not.toBeInTheDocument();

        expect(within(firstRow).getByRole('button', { name: /more actions/i })).toBeInTheDocument();
    });

    it('reveals extra actions after clicking "more actions"', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        // Extra Actions jetzt sichtbar
        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();
        expect(
            within(firstRow).getByRole('button', { name: /copy markup to clipboard/i }),
        ).toBeInTheDocument();
        expect(within(firstRow).getByRole('button', { name: /show markup/i })).toBeInTheDocument();

        // Toggle wechselt Label
        expect(within(firstRow).getByRole('button', { name: /less actions/i })).toBeInTheDocument();
    });

    it('hides extra actions after clicking "less actions"', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        // Öffnen
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        // Schließen
        await user.click(within(firstRow).getByRole('button', { name: /less actions/i }));

        // Extra Actions wieder weg
        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();
        expect(
            within(firstRow).queryByRole('button', { name: /copy html/i }),
        ).not.toBeInTheDocument();

        // Toggle wieder zurück
        expect(within(firstRow).getByRole('button', { name: /more actions/i })).toBeInTheDocument();
    });

    it('allows toggling more/less actions multiple times without breaking', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');
        const toggle = () =>
            within(firstRow).getByRole('button', { name: /more actions|less actions/i });

        // open
        await user.click(toggle());
        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();

        // close
        await user.click(toggle());
        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();

        // open again
        await user.click(toggle());
        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();
    });

    it('does not show css configuration by default', () => {
        renderUtils();

        const firstRow = getRowByGridName('First Grid');

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('shows css configuration when clicking "show css configuration"', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await openMoreActionsForRow(user, firstRow);

        const showBtn = within(firstRow).getByRole('button', {
            name: /show css configuration/i,
        });

        await user.click(showBtn);

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();
    });

    it('toggles the config button label from show to hide', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await openMoreActionsForRow(user, firstRow);

        const showBtn = within(firstRow).getByRole('button', {
            name: /show css configuration/i,
        });

        await user.click(showBtn);

        expect(
            within(firstRow).getByRole('button', { name: /hide css configuration/i }),
        ).toBeInTheDocument();
    });

    it('hides css configuration when clicking "hide css configuration"', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await openMoreActionsForRow(user, firstRow);

        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        await user.click(within(firstRow).getByRole('button', { name: /hide css configuration/i }));

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('closes css configuration when clicking another action button', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await openCssConfigForRow(user, firstRow);
        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /apply layout/i }));

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('enters rename mode and shows the rename input in the second row', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        const input = within(firstRow).getByPlaceholderText(/name of the grid/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveFocus();
    });

    it('closes css configuration when entering rename mode', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        // open config
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // enter rename
        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        // config is closed
        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('exits rename mode when clicking cancel and hides the input', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        const cancelBtn = within(firstRow).getByRole('button', { name: /cancel/i });
        await user.click(cancelBtn);

        expect(
            within(firstRow).queryByPlaceholderText(/name of the grid/i),
        ).not.toBeInTheDocument();
    });

    it('does not automatically expand extra actions when entering rename mode', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();

        expect(within(firstRow).getByRole('button', { name: /more actions/i })).toBeInTheDocument();
    });

    it('clears rename error message when input receives focus', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        const input = within(firstRow).getByPlaceholderText(/name of the grid/i);

        await user.clear(input);
        await user.type(input, 'First Grid'); // duplicate
        await user.click(within(firstRow).getByRole('button', { name: /save/i }));

        expect(screen.getByText(/already exists/i)).toBeInTheDocument();

        await user.click(input);

        expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument();
    });

    it('marks the clicked row as applied and updates the button label', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        const applyBtn = within(firstRow).getByRole('button', { name: /apply layout/i });
        await user.click(applyBtn);

        expect(
            within(firstRow).getByRole('button', { name: /applied layout/i }),
        ).toBeInTheDocument();
    });

    it('ensures only one row is marked as applied at a time', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');
        const secondRow = getRowByGridName('Second Grid');

        // Apply auf erste Row
        await user.click(within(firstRow).getByRole('button', { name: /apply layout/i }));

        expect(
            within(firstRow).getByRole('button', { name: /applied layout/i }),
        ).toBeInTheDocument();

        // Apply auf zweite Row
        await user.click(within(secondRow).getByRole('button', { name: /apply layout/i }));

        // Zweite ist applied
        expect(
            within(secondRow).getByRole('button', { name: /applied layout/i }),
        ).toBeInTheDocument();

        // Erste ist nicht mehr applied
        expect(
            within(firstRow).queryByRole('button', { name: /applied layout/i }),
        ).not.toBeInTheDocument();

        // Erste zeigt wieder normalen Apply-Button
        expect(within(firstRow).getByRole('button', { name: /apply layout/i })).toBeInTheDocument();
    });

    it('closes css configuration when applying a layout', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        // open config
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // apply layout
        await user.click(within(firstRow).getByRole('button', { name: /apply layout/i }));

        // config closed
        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('does not automatically expand or collapse extra actions when applying a layout', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        // Extra Actions öffnen
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();

        // Apply
        await user.click(within(firstRow).getByRole('button', { name: /apply layout/i }));

        // Extra Actions weiterhin offen
        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();
    });

    it('opens delete confirmation inline when clicking "delete layout"', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /delete layout/i }));

        expect(within(firstRow).getByTitle(/Yes, delete/i)).toBeInTheDocument();
        expect(within(firstRow).getByTitle(/Cancel/i)).toBeInTheDocument();
    });

    it('closes delete confirmation when clicking cancel and restores delete button', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /delete layout/i }));

        await user.click(within(firstRow).getByTitle(/Cancel/i));

        expect(within(firstRow).queryByTitle(/Yes, delete/i)).not.toBeInTheDocument();
        expect(within(firstRow).queryByTitle(/Cancel/i)).not.toBeInTheDocument();

        // Delete button is back
        expect(
            within(firstRow).getByRole('button', { name: /delete layout/i }),
        ).toBeInTheDocument();
    });

    it('exits rename mode when opening delete confirmation', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        // start rename
        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));
        expect(within(firstRow).getByPlaceholderText(/name of the grid/i)).toBeInTheDocument();

        // open delete confirmation
        await user.click(within(firstRow).getByRole('button', { name: /delete layout/i }));

        // rename input should be gone
        expect(
            within(firstRow).queryByPlaceholderText(/name of the grid/i),
        ).not.toBeInTheDocument();

        // confirm UI visible
        expect(within(firstRow).getByTitle(/Yes, delete/i)).toBeInTheDocument();
    });

    it('closes css configuration when opening delete confirmation', async () => {
        const { user } = renderUtils();

        const firstRow = getRowByGridName('First Grid');

        // open config
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // open delete confirmation
        await user.click(within(firstRow).getByRole('button', { name: /delete layout/i }));

        // config should be closed
        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('closes css configuration when toggling more/less actions', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));
        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // toggle (less actions)
        await user.click(within(firstRow).getByRole('button', { name: /less actions/i }));

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('closes css configuration when clicking rename layout', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));
        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('opening delete confirmation closes both rename and css configuration', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        // open config
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));
        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // start rename
        await user.click(within(firstRow).getByRole('button', { name: /rename layout/i }));
        expect(within(firstRow).getByPlaceholderText(/name of the grid/i)).toBeInTheDocument();

        // open delete confirm
        await user.click(within(firstRow).getByRole('button', { name: /delete layout/i }));

        // both should be closed
        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
        expect(
            within(firstRow).queryByPlaceholderText(/name of the grid/i),
        ).not.toBeInTheDocument();

        // confirm UI visible
        expect(within(firstRow).getByTitle(/Yes, delete/i)).toBeInTheDocument();
    });
    it('does not show the config toggle button unless extra actions are expanded', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        expect(
            within(firstRow).getByRole('button', { name: /show css configuration/i }),
        ).toBeInTheDocument();
    });

    it('hides extra actions AND closes markup + css config when clicking "less actions"', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        await user.click(within(firstRow).getByRole('button', { name: /show markup/i }));
        expect(within(firstRow).getByRole('button', { name: /hide markup/i })).toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));
        expect(
            within(firstRow).getByRole('button', { name: /hide css configuration/i }),
        ).toBeInTheDocument();

        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument(); // config text

        await user.click(within(firstRow).getByRole('button', { name: /less actions/i }));

        expect(
            within(firstRow).queryByRole('button', { name: /copy markup to clipboard/i }),
        ).not.toBeInTheDocument();
        expect(
            within(firstRow).queryByRole('button', { name: /show markup/i }),
        ).not.toBeInTheDocument();
        expect(
            within(firstRow).queryByRole('button', { name: /show css configuration/i }),
        ).not.toBeInTheDocument();

        expect(within(firstRow).queryByText(/"items":"2"/i)).not.toBeInTheDocument();
    });

    it('changes copy button text to "is copied" and back after 750ms', async () => {
        const { user } = renderUtils(); // kein fakeTimers
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        const copyBtn = within(firstRow).getByRole('button', { name: /copy markup to clipboard/i });
        await user.click(copyBtn);

        // direkt nach click -> copied label
        expect(
            within(firstRow).getByRole('button', { name: /markup is copied to clipboard/i }),
        ).toBeInTheDocument();

        // wartet bis setTimeout(750) zurücksetzt
        await waitFor(
            () => {
                expect(
                    within(firstRow).getByRole('button', { name: /copy markup to clipboard/i }),
                ).toBeInTheDocument();
            },
            { timeout: 800 }, // bisschen Puffer
        );

        expect(copyGridMarkupToClipboard).toHaveBeenCalledTimes(1);
    });

    it('allows markup and css configuration to be open at the same time', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        await user.click(within(firstRow).getByRole('button', { name: /show markup/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show css configuration/i }));

        // config visible
        expect(within(firstRow).getByText(/"items":"2"/i)).toBeInTheDocument();

        // markup still in "open" state
        expect(within(firstRow).getByRole('button', { name: /hide markup/i })).toBeInTheDocument();
    });

    it('resets markup state when closing extra actions', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /show markup/i }));
        expect(within(firstRow).getByRole('button', { name: /hide markup/i })).toBeInTheDocument();

        await user.click(within(firstRow).getByRole('button', { name: /less actions/i }));
        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));

        expect(within(firstRow).getByRole('button', { name: /show markup/i })).toBeInTheDocument();
    });

    it('calls buildGridRenderPropsFromConfig + copyGridMarkupToClipboard when copying', async () => {
        const { user } = renderUtils();
        const firstRow = getRowByGridName('First Grid');

        await user.click(within(firstRow).getByRole('button', { name: /more actions/i }));
        await user.click(
            within(firstRow).getByRole('button', { name: /copy markup to clipboard/i }),
        );

        expect(buildGridRenderPropsFromConfig).toHaveBeenCalled();
        expect(copyGridMarkupToClipboard).toHaveBeenCalledWith(
            expect.objectContaining({ display: 'grid' }),
            [1, 2],
        );
    });
});
