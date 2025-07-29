import userGridReducer, { addGrid, resetUserGrid } from '@/store/userGridSlice';
import { UserGridState } from '@/types/Redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNewLayoutId = 'mock-uuid-1234';

vi.mock('uuid', () => ({
    v4: () => mockNewLayoutId,
}));

describe('userGridSlice', () => {
    const initialState: UserGridState = {
        userId: null,
        savedGrids: {},
    };

    beforeEach(() => {
        vi.useRealTimers();
    });

    it('should return the initial state', () => {
        expect(userGridReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle addGrid', () => {
        const gridPayload = {
            config: {
                items: '3',
                columns: '4',
                gap: '3',
                border: '1',
                paddingX: '5',
                paddingY: '3',
            },
        };

        const result = userGridReducer(initialState, addGrid(gridPayload));

        expect(Object.keys(result.savedGrids)).toContain(mockNewLayoutId);
        expect(result.savedGrids[mockNewLayoutId]).toMatchObject({
            layoutId: mockNewLayoutId,
            config: gridPayload.config,
        });
        expect(typeof result.savedGrids[mockNewLayoutId].timestamp).toBe('string');
    });

    it('should handle resetUserGrid', () => {
        const modifiedState: UserGridState = {
            userId: 1,
            savedGrids: {
                mockNewLayoutId: {
                    layoutId: mockNewLayoutId,
                    timestamp: '2023-01-01T00:00:00.000Z',
                    config: {
                        items: '3',
                        columns: '4',
                        gap: '3',
                        border: '1',
                        paddingX: '5',
                        paddingY: '3',
                    },
                },
            },
        };

        const result = userGridReducer(modifiedState, resetUserGrid());
        expect(result).toEqual(initialState);
    });
});
