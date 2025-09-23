import { GridConfig } from '@/types/Redux';
import { beforeEach, describe, it, vi } from 'vitest';

// 1️⃣ Mock Axios **vor allen Imports**
vi.mock('@/plugins/axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

// 2️⃣ Dann die Thunks importieren
import ApiClient from '@/plugins/axios';
import {
    deleteThisGridThunk,
    fetchUserGridsThunk,
    resetUserGridsThunk,
    saveUserGridThunk,
} from '@/store/thunks/userSaveGridsThunks';
import { userLoggedAdmin } from '@/tests/mocks/api';

describe('userSaveGridsThunks', () => {
    const mockedApiClient = ApiClient as unknown as {
        get: ReturnType<typeof vi.fn>;
        post: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    let dispatch: any;
    let getState: any;

    beforeEach(() => {
        vi.clearAllMocks();
        dispatch = vi.fn();
        getState = vi.fn();
    });

    it('fetchUserGridsThunk resolves with data', async () => {
        const mockData = {
            grid1: {
                layoutId: 'grid1',
                name: 'Grid 1',
                config: {},
                timestamp: '2025-09-23',
            } as GridConfig,
        };
        mockedApiClient.get.mockResolvedValue({ data: { data: mockData } });

        const thunk = fetchUserGridsThunk(userLoggedAdmin);

        const result = await thunk(dispatch, getState, { rejectWithValue: vi.fn() });

        expect(mockedApiClient.get).toHaveBeenCalledWith('/user/grids', { withCredentials: true });
        expect(result.payload).toEqual(mockData);
    });

    it('saveUserGridThunk resolves with new grid', async () => {
        const newGrid: GridConfig = {
            layoutId: 'grid2',
            name: 'Grid 2',
            config: {
                items: '10',
                columns: '3',
                gap: '8px',
                border: '1px solid #000',
                paddingX: '4px',
                paddingY: '4px',
            },
            timestamp: '2025-09-23',
        };
        mockedApiClient.post.mockResolvedValue({ data: { data: newGrid } });

        const result = await saveUserGridThunk(newGrid)(dispatch, getState, undefined);

        expect(mockedApiClient.post).toHaveBeenCalledWith(
            '/grids',
            {
                layoutId: newGrid.layoutId,
                name: newGrid.name,
                config: newGrid.config,
                timestamp: newGrid.timestamp,
            },
            { withCredentials: true },
        );
        expect(result.payload).toEqual(newGrid);
    });

    it('resetUserGridsThunk resolves with userId', async () => {
        mockedApiClient.delete.mockResolvedValue({});

        const result = await resetUserGridsThunk(123)(dispatch, getState, undefined);

        expect(mockedApiClient.delete).toHaveBeenCalledWith('/users/123/grids', {
            withCredentials: true,
        });
        expect(result.payload).toBe(123);
    });
    it('deleteThisGridThunk resolves with layoutId', async () => {
        mockedApiClient.delete.mockResolvedValue({});

        const result = await deleteThisGridThunk('grid1')(dispatch, getState, undefined);

        expect(mockedApiClient.delete).toHaveBeenCalledWith('/grids/by-layout/grid1', {
            withCredentials: true,
        });
        expect(result.payload).toBe('grid1');
    });
});
