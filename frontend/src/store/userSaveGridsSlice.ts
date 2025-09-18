import ApiClient from '@/plugins/axios';
import {
    clearUserGridsFromLocalStorage,
    loadFromLocalStorage,
    saveToLocalStorage,
} from '@/store/localStorage';
import { GridConfig, GridConfigKey, UserSaveGridsState } from '@/types/Redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialGrid = {
    items: '1',
    columns: '1',
    gap: '0',
    border: '0',
    paddingX: '0',
    paddingY: '0',
};

const initialLayoutId = 'initial';
const initialName = initialLayoutId;

export const initialState: UserSaveGridsState = {
    userId: null,
    savedGrids: {
        [initialLayoutId]: {
            layoutId: initialLayoutId,
            timestamp: new Date().toISOString(),
            config: { ...initialGrid },
            name: initialName,
        },
    },
};

const createInitialGrid = (baseConfig: GridConfig['config'], name?: string): GridConfig => {
    const newLayoutId = uuidv4();

    return {
        layoutId: newLayoutId,
        timestamp: new Date().toISOString(),
        config: { ...baseConfig },
        name: name?.trim() || 'Unnamed Grid',
    };
};

// fetchUserGridsThunk
export const fetchUserGridsThunk = createAsyncThunk<
    Record<string, GridConfig>, // Rückgabe vom Backend: keyed Object
    number, // userId als Argument
    { rejectValue: string }
>('userGrids/fetchUserGrids', async (_userId, { rejectWithValue }) => {
    console.log('👉 fetchUserGridsThunk gestartet mit userId', _userId);
    try {
        const response = await ApiClient.get('/user/grids', { withCredentials: true });
        // payload ist jetzt ein Object keyed by layoutId
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Fehler beim Laden der Grids');
    }
});

export const resetUserGridsThunk = createAsyncThunk<
    number, // Rückgabe: userId
    number, // Argument: userId
    { rejectValue: string }
>('userGrids/resetUserGrids', async (userId: number, { rejectWithValue }) => {
    try {
        await ApiClient.delete(`/users/${userId}/grids`, { withCredentials: true });
        return userId; // action.payload
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || `Fehler beim ${userId} Zurücksetzen`,
        );
    }
});

export const deleteThisGridThunk = createAsyncThunk<
    string, // Rückgabe: layoutId
    string, // Rückgabe: layoutId
    { rejectValue: string }
>('userGrids/deleteThisGrid', async (layoutId: string, { rejectWithValue }) => {
    try {
        await ApiClient.delete(`/grids/by-layout/${layoutId}`, { withCredentials: true });
        return layoutId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || `Fehler beim ${layoutId} Löschen`);
    }
});

const userSaveGridsSlice = createSlice({
    name: 'userGrid',
    initialState,
    reducers: {
        getGridsFromLocalStorage(state, action: PayloadAction<number>) {
            state.userId = action.payload;

            const persisted = loadFromLocalStorage(state.userId);
            if (persisted && persisted.savedGrids && typeof persisted.savedGrids === 'object') {
                state.savedGrids = persisted.savedGrids;
            }
        },

        saveInitialGrid(state, action: PayloadAction<string>) {
            if (state.userId === null || state.userId === undefined) return;

            const gridConfig = state.savedGrids[initialLayoutId]?.config ?? { ...initialGrid };
            const layoutName = action.payload;
            const newGrid = createInitialGrid(gridConfig, layoutName);

            state.savedGrids[newGrid.layoutId] = newGrid;
            saveToLocalStorage(state.userId, state);
        },

        deleteThisGrid(state, action: PayloadAction<string>) {
            const layoutId = action.payload;
            if (!state.userId) return;

            delete state.savedGrids[layoutId];
            saveToLocalStorage(state.userId, state);
        },

        updateGridConfig(
            state,
            action: PayloadAction<{ layoutId: string; key: GridConfigKey; value: string }>,
        ) {
            if (state.userId === null || state.userId === undefined) return;

            const { layoutId, key, value } = action.payload;
            const targetGrid = state.savedGrids[layoutId];

            if (!targetGrid || !(key in targetGrid.config)) return;

            targetGrid.config[key] = value;
            targetGrid.timestamp = new Date().toISOString();

            saveToLocalStorage(state.userId, state);
        },

        // helper (for developing) to clear all grids //
        resetUserGrids(state, action: PayloadAction<number>) {
            const userId = action.payload;
            if (!userId) return;

            clearUserGridsFromLocalStorage(userId);

            state.savedGrids = { ...initialState.savedGrids };

            saveToLocalStorage(userId, state);
        },

        loadUserGrids(state, action: PayloadAction<UserSaveGridsState>) {
            state.userId = action.payload.userId;
            if (action.payload.savedGrids && typeof action.payload.savedGrids === 'object') {
                state.savedGrids = action.payload.savedGrids;
            }

            if (state.userId) saveToLocalStorage(state.userId, state);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(resetUserGridsThunk.fulfilled, (state, action) => {
            userSaveGridsSlice.caseReducers.resetUserGrids(state, {
                payload: action.payload,
                type: '',
            });
        });
        builder.addCase(resetUserGridsThunk.rejected, (_state, action) => {
            console.error('Reset fehlgeschlagen', action.payload);
        });

        builder.addCase(deleteThisGridThunk.fulfilled, (state, action) => {
            userSaveGridsSlice.caseReducers.deleteThisGrid(state, {
                payload: action.payload,
                type: '',
            });
        });
        builder.addCase(deleteThisGridThunk.rejected, (_state, action) => {
            console.error('Löschen fehlgeschlagen', action.payload);
        });

        builder.addCase(fetchUserGridsThunk.fulfilled, (state, action) => {
            if (!state.userId) return;

            // Behalte den 'initial' Eintrag
            const initialGridEntry = state.savedGrids.initial;

            // action.payload ist Object keyed by layoutId
            state.savedGrids = {
                initial: initialGridEntry, // behalten
                ...action.payload, // Backend Grids hinzufügen
            };

            saveToLocalStorage(state.userId, state);
        });

        builder.addCase(fetchUserGridsThunk.rejected, (_state, action) => {
            console.error('Fetch grids fehlgeschlagen', action.payload);
        });
    },
});

export const {
    getGridsFromLocalStorage,
    saveInitialGrid,
    deleteThisGrid,
    updateGridConfig,
    resetUserGrids,
    loadUserGrids,
} = userSaveGridsSlice.actions;
export default userSaveGridsSlice.reducer;
