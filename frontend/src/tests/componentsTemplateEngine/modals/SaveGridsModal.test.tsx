// SaveGridsModal.test.tsx
import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import * as reduxHooks from '@/store/hooks';
import * as selectors from '@/store/selectors/loginSelectors';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('SaveGridsModal', () => {
    const mockDispatch = vi.fn();

    const mockGrids = [
        {
            layoutId: 'initial',
            timestamp: new Date().toISOString(),
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
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock Dispatch
        vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

        // Mock useAppSelector für selectUserId und selectSortedGrids
        vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) => {
            if (selector === selectors.selectUserId) return 'user-123';
            if (selector === userGridSelectors.selectSortedGrids) return mockGrids;
            return null;
        });

        // Stub localStorage
        vi.stubGlobal('localStorage', {
          getItem: vi.fn(),
          setItem: vi.fn(),  // <-- DAS ist wichtig
          removeItem: vi.fn(),
          clear: vi.fn(),
        });
    });

    const renderUtils = async () => {
        const user = userEvent.setup();
        render(<SaveGridsModal />);
        const triggerButton = screen.getByRole('button', {
            name: /Meaningful names do half the work/i,
        });
        return { user, triggerButton };
    };

    it('renders the trigger button', async () => {
        const { triggerButton } = await renderUtils();
        expect(triggerButton).toBeInTheDocument();
    });

    it('opens and closes the modal via close icon and close button', async () => {
        const { user, triggerButton } = await renderUtils();
        await user.click(triggerButton);

        expect(await screen.findByTestId('dialog-markup')).toBeVisible();
        expect(screen.getByText(/Save Grid/i)).toBeInTheDocument();

        // Close via X icon
        await user.click(screen.getByLabelText(/Close modal/i));
        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });

        // Reopen
        await user.click(triggerButton);

        // Close via "close" button inside modal
        const closeBtn = await screen.findByText(/close/i);
        await user.click(closeBtn);
        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });
    });

    it('clicking save button dispatches saveInitialGrid and disables save Button', async () => {
        const { user, triggerButton } = await renderUtils();
        await user.click(triggerButton);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        expect(saveBtn).toBeEnabled();

        await user.click(saveBtn);

        // Prüfen, dass der Dispatch korrekt aufgerufen wird
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'userGrid/saveInitialGrid'
        }));

        // Button sollte deaktiviert sein
        expect(saveBtn).toBeDisabled();

        // SavedGridList sollte sichtbar sein
        expect(screen.getByText(/Saved Grids/i)).toBeInTheDocument();
        expect(screen.getByText(/\{"items":"1","columns":"1","gap":"0","border":"0","paddingX":"0","paddingY":"0"\}/i)).toBeInTheDocument();
    });

});
