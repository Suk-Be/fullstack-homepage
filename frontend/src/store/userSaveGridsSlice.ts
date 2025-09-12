import ApiClient from '@/plugins/axios';
import { clearUserGridsFromLocalStorage, loadFromLocalStorage, saveToLocalStorage } from '@/store/localStorage';
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
const initialName = initialLayoutId

export const initialState: UserSaveGridsState = {
    userId: null,
    savedGrids: {
        [initialLayoutId]: {
            layoutId: initialLayoutId,
            timestamp: new Date().toISOString(),
            config: { ...initialGrid },
            name: initialName, // optional zur Anzeige
        },
    },
};

const createInitialGrid = (
    baseConfig: GridConfig["config"],
    name?: string
): GridConfig => {
    const newLayoutId = uuidv4();

    return {
        layoutId: newLayoutId,
        timestamp: new Date().toISOString(),
        config: { ...baseConfig },
        name: name?.trim() || "Unnamed Grid",
    };
};

export const resetUserGridsThunk = createAsyncThunk(
  'userGrids/resetUserGrids',
  async (userId: number, { rejectWithValue }) => {
    try {
      await ApiClient.delete(`/users/${userId}/grids`, {
        withCredentials: true, // falls Sanctum benutzt wird
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Fehler beim Zurücksetzen');
    }
  }
);

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
            const layoutName = action.payload
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
        resetUserGrids(state) {
            if (state.userId === null || state.userId === undefined) return;

            clearUserGridsFromLocalStorage(state.userId);

            state.savedGrids = { ...initialState.savedGrids };

            saveToLocalStorage(state.userId, state);
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
        // LocalStorage + state komplett löschen
        if (state.userId === action.payload) {
          state.savedGrids = {};
        }
      });
      builder.addCase(resetUserGridsThunk.rejected, (_, action) => {
        console.error('Reset fehlgeschlagen', action.payload);
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
