import {
    clearUserGridsFromLocalStorage,
    loadFromLocalStorage,
    saveToLocalStorage,
} from '@/store/localStorage';
import {
    deleteThisGridThunk,
    fetchUserGridsThunk,
    renameThisGridThunk,
    resetUserGridsThunk,
    saveUserGridThunk,
} from '@/store/thunks/userSaveGridsThunks';
import { GridConfig, GridConfigKey, UserSaveGridsState } from '@/types/Redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const initialLayoutId = 'initialLayoutId' as const;
export const initialName = 'initialName';
export const initialGridConfig = {
    items: '1',
    columns: '1',
    gap: '0',
    border: '0',
    paddingX: '0',
    paddingY: '0',
};

const initialState: UserSaveGridsState = {
    userId: null,
    savedGrids: {
        [initialLayoutId]: {
            layoutId: initialLayoutId,
            timestamp: new Date().toISOString(),
            config: { ...initialGridConfig },
            name: initialName,
        },
    },
};

const createGrid = (baseConfig: GridConfig['config'], name?: string): GridConfig => {
    const newLayoutId = uuidv4();

    return {
        layoutId: newLayoutId,
        timestamp: new Date().toISOString(),
        config: { ...baseConfig },
        name: name?.trim() || 'Unnamed Grid',
    };
};

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

        saveGrid(state, action: PayloadAction<string>) {
            if (state.userId === null || state.userId === undefined) return;

            const gridConfig = state.savedGrids[initialLayoutId].config;
            const layoutName = action.payload;
            const newGrid = createGrid(gridConfig, layoutName);
            state.savedGrids[newGrid.layoutId] = newGrid;

            saveToLocalStorage(state.userId, state);
        },

        applySavedGridToInitial(state, action: PayloadAction<string>) {
            const sourceLayoutId = action.payload;
            const sourceGrid = state.savedGrids[sourceLayoutId];
            const targetGrid = state.savedGrids[initialLayoutId];

            if (!sourceGrid || !targetGrid) return;

            targetGrid.config = { ...sourceGrid.config };

            targetGrid.timestamp = new Date().toISOString();

            if (state.userId) {
                saveToLocalStorage(state.userId, state);
            }
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
        // reset(all)Grids
        builder.addCase(resetUserGridsThunk.fulfilled, (state, action) => {
            userSaveGridsSlice.caseReducers.resetUserGrids(state, {
                payload: action.payload,
                type: '',
            });
        });
        builder.addCase(resetUserGridsThunk.rejected, (_state, action) => {
            console.error('Reset fehlgeschlagen', action.payload);
        });

        // reset(this)Grid
        builder.addCase(deleteThisGridThunk.fulfilled, (state, action) => {
            userSaveGridsSlice.caseReducers.deleteThisGrid(state, {
                payload: action.payload,
                type: '',
            });
        });
        builder.addCase(deleteThisGridThunk.rejected, (_state, action) => {
            console.error('Löschen fehlgeschlagen', action.payload);
        });

        // rename(this)Grid
        builder.addCase(renameThisGridThunk.fulfilled, (state, action) => {
            const { layoutId, newName } = action.payload;
            if (state.savedGrids[layoutId]) {
                state.savedGrids[layoutId].name = newName;
                if (state.userId) {
                    saveToLocalStorage(state.userId, state);
                }
            }
        });
        builder.addCase(renameThisGridThunk.rejected, (_state, action) => {
            console.error('Rename failed:', action.payload);
        });

        // fetchGrids
        builder.addCase(fetchUserGridsThunk.fulfilled, (state, action) => {
            if (!state.userId) return;

            // todo hier müssen alle grids erhalten bleiben

            // Behalte das grid 'initialLayoutId'
            const initialGridEntry = state.savedGrids.initialLayoutId;

            // action.payload ist Object keyed by layoutId
            state.savedGrids = {
                initialLayoutId: initialGridEntry, // behalten
                ...action.payload, // Backend Grids hinzufügen
            };

            saveToLocalStorage(state.userId, state);
        });

        builder.addCase(fetchUserGridsThunk.rejected, (_state, action) => {
            console.error('Fetch grids fehlgeschlagen', action.payload);
        });

        // save(this)Grid
        builder.addCase(saveUserGridThunk.fulfilled, (state, action) => {
            if (!state.userId) return;

            const grid = action.payload;

            state.savedGrids[action.payload.layoutId] = grid;

            saveToLocalStorage(state.userId, state);
        });

        builder.addCase(saveUserGridThunk.rejected, (_state, action) => {
            console.error('Grid speichern fehlgeschlagen:', action.payload);
        });
    },
});

export const {
    getGridsFromLocalStorage,
    saveGrid,
    applySavedGridToInitial,
    deleteThisGrid,
    updateGridConfig,
    resetUserGrids,
    loadUserGrids,
} = userSaveGridsSlice.actions;
export { createGrid, initialState };
export default userSaveGridsSlice.reducer;
