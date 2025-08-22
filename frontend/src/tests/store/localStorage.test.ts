import { loadFromLocalStorage, saveToLocalStorage } from '@/store/localStorage';
import { UserSaveGridsState } from '@/types/Redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('localStorage helpers', () => {
  const mockUserId = 1;
  const mockState: UserSaveGridsState = {
    userId: mockUserId,
    savedGrids: {
      layout1: { 
        layoutId: 'layout1', 
        timestamp: new Date().toISOString(),
        config: { 
          items: '2', 
          columns: '3', 
          gap: '1', 
          border: '1', 
          paddingX: '2', 
          paddingY: '2' 
        } 
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // localStorage mocken
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should save grids to localStorage', () => {
    saveToLocalStorage(mockUserId, mockState);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      `userGrid_${mockUserId}`,
      JSON.stringify({ savedGrids: mockState.savedGrids })
    );
  });

  it('should load grids from localStorage', () => {
    const storedValue = JSON.stringify({ savedGrids: mockState.savedGrids });
    (localStorage.getItem as any).mockReturnValue(storedValue);

    const result = loadFromLocalStorage(mockUserId);

    expect(localStorage.getItem).toHaveBeenCalledWith(`userGrid_${mockUserId}`);
    expect(result).toEqual(mockState);
  });

  it('should return null if no data in localStorage', () => {
    (localStorage.getItem as any).mockReturnValue(null);

    const result = loadFromLocalStorage(mockUserId);

    expect(result).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (localStorage.getItem as any).mockReturnValue('invalid json');

    const result = loadFromLocalStorage(mockUserId);

    expect(result).toBeNull();
  });
});
