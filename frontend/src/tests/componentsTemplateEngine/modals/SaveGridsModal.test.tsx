import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import * as reduxHooks from '@/store/hooks';
import * as loginSelectors from '@/store/selectors/loginSelectors';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import * as userGridSlice from '@/store/userSaveGridsSlice';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, vi } from 'vitest';

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
        let currentGrids = [...mockGrids];

        vi.clearAllMocks();
        // access and return dispatches
        vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        // access and return state
        vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) => {
            if (selector === loginSelectors.selectUserId) return 'user-123';
            if (selector === userGridSelectors.selectGridsFromThisUser) return currentGrids;
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

        const openModalButton = screen.getByRole('button', {
            name: /with a meaningful name/i,
        });
        return { user, openModalButton };
    };

    it('renders the trigger button', async () => {
        const { openModalButton } = await renderModal();
        expect(openModalButton).toBeInTheDocument();
    });

    it('dispatches getGridsFromLocalStorage when userId is set', async () => {
      await renderModal();
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: userGridSlice.getGridsFromLocalStorage.type,
          payload: 'user-123',
        })
      );
    });

    it('opens and closes the modal via close icon and close button', async () => {
        const { user, openModalButton } = await renderModal();
        // open modal ui
        await user.click(openModalButton);

        const dialog = await screen.findByTestId('dialog-markup');
        expect(dialog).toBeVisible();
        // headline of modal
        expect(screen.getByText(/Save Grid/i)).toBeInTheDocument();
        
        // close modal ui
        await user.click(screen.getByLabelText(/Close modal/i));
        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });

        // open modal ui
        await user.click(openModalButton);
        const closeBtn = await screen.findByText(/close/i);
        await user.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });
    });

    it('clicking save button dispatches saveInitialGrid and disables button', async () => {
        const { user, openModalButton } = await renderModal();
        await user.click(openModalButton);

        // save grid
        // only input and buttons are displayed
        expect(
          await screen.queryByText(/Your Saved Grids:/i)
        ).not.toBeInTheDocument();

        const input = screen.getByPlaceholderText(/name of the grid/i);
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
        // after saving change in ui
        expect(saveBtn).toBeDisabled();
        const noInput = screen.queryByPlaceholderText(/name of the grid/i);
        expect(noInput).not.toBeInTheDocument();
        expect(
          await screen.findByText(/Your Saved Grids:/i)
        ).toBeInTheDocument();
        // saved grid(s) data is rendered
        expect(screen.getByText(/Test Grid/i)).toBeInTheDocument();
    });

    it('clicking reset button dispatches resetUserGrids, disables button and clears input', async () => {
      const { user, openModalButton } = await renderModal();
      await user.click(openModalButton);

      const resetBtn = screen.getByRole('button', { name: /reset/i });
      await user.click(resetBtn);

      // resets all saved grids for user-123
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: userGridSlice.resetUserGrids.type,
      }));

      expect(resetBtn).toBeDisabled();

      const input = screen.getByPlaceholderText(/name of the grid/i);
      expect(input).toHaveValue('');
    });

    it('focuses input automatically when modal opens', async () => {
      const { user, openModalButton } = await renderModal();
      await user.click(openModalButton);

      const input = await screen.findByPlaceholderText(/name of the grid/i);
      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });

    it('shows error when trying to save without a name', async () => {
      const { user, openModalButton } = await renderModal();
      await user.click(openModalButton);

      const saveBtn = screen.getByRole('button', { name: /save/i });

      mockDispatch.mockClear();

      await user.click(saveBtn);

      expect(await screen.findByText(/Please input a recognizable name/i)).toBeInTheDocument();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('shows error when grid name already exists', async () => {
      const { user, openModalButton } = await renderModal();
      await user.click(openModalButton);

      const input = screen.getByPlaceholderText(/name of the grid/i);
      await user.type(input, 'Test Grid');

      const saveBtn = screen.getByRole('button', { name: /save/i });

      mockDispatch.mockClear();

      await user.click(saveBtn);

      expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('clears error message on input focus', async () => {
      const { user, openModalButton } = await renderModal();
      await user.click(openModalButton);

      const saveBtn = screen.getByRole('button', { name: /save/i });
      await user.click(saveBtn);

      expect(await screen.findByText(/recognizable name/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/name of the grid/i);
      await user.click(input);

      await waitFor(() => {
        expect(screen.queryByText(/recognizable name/i)).not.toBeInTheDocument();
      });
    });

});
