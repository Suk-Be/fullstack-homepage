import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import * as reduxHooks from '@/store/hooks';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import { deleteThisGrid } from '@/store/userSaveGridsSlice';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('SavedGridList', () => {
  const mockDispatch = vi.fn();

  const mockGrids = [
    {
      layoutId: 'initial',
      name: 'First Grid',
      timestamp: new Date().toISOString(),
      config: { items: '1', columns: '2', gap: '0', border: '0', paddingX: '0', paddingY: '0' },
    },
    {
      layoutId: 'grid2',
      name: 'Second Grid',
      timestamp: new Date().toISOString(),
      config: { items: '3', columns: '4', gap: '1', border: '1', paddingX: '2', paddingY: '2' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  const renderList = (grids = mockGrids) => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) => {
      if (selector === userGridSelectors.selectSortedGrids) return grids; 
      return [];
    });

    render(<SavedGridList />);
  };

  it('renders "No grids saved yet" when there are no grids', () => {
    // pass no grids
    renderList([]);
    expect(screen.getByText(/No grids saved yet/i)).toBeInTheDocument();
  });

  it('renders a list of saved grids', () => {
    renderList();

    expect(screen.getByText(/Your Saved Grids:/i)).toBeInTheDocument();
    expect(screen.getByText(/First Grid/i)).toBeInTheDocument();
    expect(screen.getByText(/Second Grid/i)).toBeInTheDocument();

    expect(screen.getByText(/items": "1"/i)).toBeInTheDocument();
    expect(screen.getByText(/columns": "4"/i)).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('toggles config text on click (truncate long text)', async () => {
    renderList();
    const user = userEvent.setup();

    const configCell = screen.getByText(/items": "1"/i);
    expect(configCell).toHaveClass('truncate');

    await user.click(configCell);
    expect(configCell).not.toHaveClass('truncate');

    await user.click(configCell);
    expect(configCell).toHaveClass('truncate');
  });

  it('opens a confirmation dialog: confirm or cancel a delete action', async () => {
    renderList();
    const user = userEvent.setup();

    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    await user.click(deleteBtn);

    // buttons haben title tag
    expect(screen.getByTitle(/Yes, delete/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Cancel/i)).toBeInTheDocument();

    // Cancel klicken
    await user.click(screen.getByTitle(/Cancel/i));
    expect(screen.queryByTitle(/Yes, delete/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/Cancel/i)).not.toBeInTheDocument();
  });

  it('confirms delete and dispatches deleteThisGrid', async () => {
    renderList();
    const user = userEvent.setup();

    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    await user.click(deleteBtn);

    const confirmBtn = screen.getByTitle(/Yes, delete/i);
    await user.click(confirmBtn);

    expect(mockDispatch).toHaveBeenCalledWith(deleteThisGrid('initial'));
  });
});
