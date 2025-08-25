import SavedGridList from '@/componentsTemplateEngine/gridSaver/SavedGridList';
import * as reduxHooks from '@/store/hooks';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('SavedGridList', () => {
  const mockGrids = [
    {
      layoutId: 'initial',
      timestamp: new Date().toISOString(),
      config: { items: '1', columns: '2', gap: '0', border: '0', paddingX: '0', paddingY: '0' },
    },
    {
      layoutId: 'grid2',
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

    expect(screen.getByText(/Saved Grids/i)).toBeInTheDocument();

    mockGrids.forEach((grid) => {
      expect(screen.getByText(JSON.stringify(grid.config))).toBeInTheDocument();
    });
  });
});
