import {
    selectGridsFromThisUser,
    selectInitialGrid,
    selectSavedGridsMap,
    selectSortedGrids,
} from '@/store/selectors/userGridSelectors';
import { UserSaveGridsState } from '@/types/Redux';

describe('userGridSelectors', () => {
    const mockState = {
        userGrid: {
            userId: 1,
            savedGrids: {
                initialLayoutId: {
                    layoutId: 'initial',
                    timestamp: '2025-08-25T12:00:00.000Z',
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
                grid2: {
                    layoutId: 'grid2',
                    timestamp: '2025-08-25T13:00:00.000Z',
                    name: 'grid2',
                    config: {
                        items: '2',
                        columns: '2',
                        gap: '1',
                        border: '1',
                        paddingX: '2',
                        paddingY: '2',
                    },
                },
            },
        },
    } as { userGrid: UserSaveGridsState };

    it('selectSavedGridsMap returns all savedGrids', () => {
        const result = selectSavedGridsMap(mockState as any);
        expect(result).toEqual(mockState.userGrid.savedGrids);
    });

    it('selectInitialGrid returns only the initial grid config', () => {
        const result = selectInitialGrid(mockState as any);

        expect(result).toEqual(mockState.userGrid.savedGrids.initialLayoutId.config);
    });

    it('selectSortedGrids returns grids sorted by timestamp descending', () => {
        const result = selectSortedGrids(mockState as any);
        expect(result[0].layoutId).toBe('grid2'); // neuester Grid kommt zuerst
        expect(result[1].layoutId).toBe('initial');
    });

    it('selectGridsFromThisUser returns the grids (object keys of savedGrids) in a new array', () => {
        const result = selectGridsFromThisUser(mockState as any);

        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('initialLayoutId');
        expect(result).toHaveProperty('grid2');

        expect(result.initialLayoutId).toEqual(mockState.userGrid.savedGrids.initialLayoutId);
        expect(result.grid2).toEqual(mockState.userGrid.savedGrids.grid2);
    });
});
