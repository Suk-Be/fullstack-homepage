// SavedGridList.test.tsx
import SavedGridList from '@/componentsTemplateEngine/gridSaver/SavedGridList';
import * as reduxHooks from '@/store/hooks';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('SavedGridList', () => {
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
  });

  it('renders "No grids saved yet" when there are no grids', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue([]);
    render(<SavedGridList />);
    expect(screen.getByText(/No grids saved yet/i)).toBeInTheDocument();
  });

  it('renders a list of saved grids when grids exist', () => {
    vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue(mockGrids);
    render(<SavedGridList />);

    // Überschrift prüfen
    expect(screen.getByText(/Your Saved Grids:/i)).toBeInTheDocument();

    // Namen der Grids prüfen
    expect(screen.getByText(/First Grid/i)).toBeInTheDocument();
    expect(screen.getByText(/Second Grid/i)).toBeInTheDocument();

    // Config grob prüfen (einzelne Werte statt exact JSON.stringify)
    expect(screen.getByText(/items":"1"/i)).toBeInTheDocument();
    expect(screen.getByText(/columns":"4"/i)).toBeInTheDocument();

    // Actions-Button prüfen
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });
});
