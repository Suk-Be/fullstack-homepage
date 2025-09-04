import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import * as reduxHooks from '@/store/hooks';
import * as loginSelectors from '@/store/selectors/loginSelectors';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import * as userGridSlice from '@/store/userSaveGridsSlice';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SaveGridsModal', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;

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
    mockDispatch = vi.fn();

    const currentGrids = [...mockGrids];

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

    const openModalButton = screen.getByRole('button', { name: /with a meaningful name/i });
    return { user, openModalButton };
  };

  it('renders a dialog open button', async () => {
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
    await user.click(openModalButton);

    const dialog = await screen.findByTestId('dialog-markup');
    expect(dialog).toBeVisible();

    // Close via X
    await user.click(screen.getByLabelText(/Close modal/i));
    await waitFor(() => expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument());

    // Open again
    await user.click(openModalButton);
    const closeBtn = await screen.findByText(/close/i);
    await user.click(closeBtn);
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

    mockDispatch.mockClear();

    await user.click(saveBtn);

    const error = await screen.findByTestId('grid-error');
    expect(error).toHaveTextContent(/Please input a recognizable name/i);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('clears error message on input focus', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

    const saveBtn = screen.getByRole('button', { name: /save/i });
    await user.click(saveBtn);

    const error = await screen.findByTestId('grid-error');
    expect(error).toHaveTextContent(/Please input a recognizable name/i);

    const input = screen.getByPlaceholderText(/name of the grid/i);
    await user.click(input);

    await waitFor(() => expect(screen.queryByTestId('grid-error')).not.toBeInTheDocument());
  });

  it('shows error when grid name already exists', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

    const input = screen.getByPlaceholderText(/name of the grid/i);
    await user.type(input, 'Test Grid');

    const saveBtn = screen.getByRole('button', { name: /save/i });

    mockDispatch.mockClear();

    await user.click(saveBtn);

    const error = await screen.findByTestId('grid-error');
    expect(error).toHaveTextContent(/choose a different name/i);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows error when grid name exceeds 30 characters', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

    const input = screen.getByPlaceholderText(/name of the grid/i);
    const longName = 'A'.repeat(31);
    await user.type(input, longName);

    const error = await screen.findByTestId('grid-error');
    expect(error).toHaveTextContent(/31\/30 characters/i);

    const saveBtn = screen.getByRole('button', { name: /save/i });

    mockDispatch.mockClear();
    
    await user.click(saveBtn);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('allows saving when grid name is exactly 30 characters', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

    const input = screen.getByPlaceholderText(/name of the grid/i);
    const validName = 'B'.repeat(30);
    await user.type(input, validName);

    expect(screen.queryByText(/characters/i)).not.toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /save/i });
    await user.click(saveBtn);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: userGridSlice.saveInitialGrid.type,
        payload: validName,
      })
    );
  });

  it('clicking save button dispatches saveInitialGrid and disables button', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

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
    expect(saveBtn).toBeDisabled();
    expect(screen.queryByPlaceholderText(/name of the grid/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Your Saved Grids:/i)).toBeInTheDocument();
  });

  it('clicking reset button dispatches resetUserGrids, disables button and clears input', async () => {
    const { user, openModalButton } = await renderModal();
    await user.click(openModalButton);

    const resetBtn = screen.getByRole('button', { name: /reset/i });
    await user.click(resetBtn);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: userGridSlice.resetUserGrids.type })
    );

    expect(resetBtn).toBeDisabled();
    expect(screen.getByPlaceholderText(/name of the grid/i)).toHaveValue('');
  });
});
