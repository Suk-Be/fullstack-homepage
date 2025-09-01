import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import * as reduxHooks from '@/store/hooks';
import * as selectors from '@/store/selectors/loginSelectors';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import * as userGridSlice from '@/store/userSaveGridsSlice';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('SaveGridsModal', () => {
    const mockDispatch = vi.fn();

    const mockGrids = [
    {
      layoutId: 'grid-1',
      timestamp: new Date().toISOString(),
      name: 'Test Grid',
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

        vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) => {
            if (selector === selectors.selectUserId) return 'user-123';
            if (selector === userGridSelectors.selectSortedGrids) return mockGrids;
            return null;
        });

        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    });

    const renderModal = async () => {
        const user = userEvent.setup();
        render(<SaveGridsModal />);
        const triggerButton = screen.getByRole('button', {
            name: /Meaningful names do half the work/i,
        });
        return { user, triggerButton };
    };

    it('renders the trigger button', async () => {
        const { triggerButton } = await renderModal();
        expect(triggerButton).toBeInTheDocument();
    });

    it('opens and closes the modal via close icon and close button', async () => {
        const { user, triggerButton } = await renderModal();
        await user.click(triggerButton);

        const dialog = await screen.findByTestId('dialog-markup');
        expect(dialog).toBeVisible();
        expect(screen.getByText(/Save Grid/i)).toBeInTheDocument();

        await user.click(screen.getByLabelText(/Close modal/i));
        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });

        await user.click(triggerButton);
        const closeBtn = await screen.findByText(/close/i);
        await user.click(closeBtn);
        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });
    });

    it('clicking save button dispatches saveInitialGrid and disables button', async () => {
        const { user, triggerButton } = await renderModal();
        await user.click(triggerButton);

        const input = screen.getByPlaceholderText(/please name grid/i);
        await user.type(input, 'MyGrid');

        const saveBtn = screen.getByRole('button', { name: /save/i });
        expect(saveBtn).toBeEnabled();

        await user.click(saveBtn);

        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: userGridSlice.saveInitialGrid.type,
            payload: 'MyGrid',
          })
        );
        expect(saveBtn).toBeDisabled();
        expect(
          await screen.findByText(/Your Saved Grids:/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Test Grid/i)).toBeInTheDocument();
    });

    it('clicking reset button dispatches resetUserGrids and disables button', async () => {
        const { user, triggerButton } = await renderModal();
        await user.click(triggerButton);

        const resetBtn = screen.getByRole('button', { name: /reset/i });
        expect(resetBtn).toBeEnabled();

        await user.click(resetBtn);

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: userGridSlice.resetUserGrids.type,
        }));

        expect(resetBtn).toBeDisabled();
    });
});
