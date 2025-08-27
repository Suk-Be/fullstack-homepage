import { loadFromLocalStorage, saveToLocalStorage } from '@/store/localStorage';
import { GridConfigKey, UserSaveGridsState } from '@/types/Redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const initialState: UserSaveGridsState = {
    userId: null,
    savedGrids: {
        [initialLayoutId]: {
            layoutId: initialLayoutId,
            timestamp: new Date().toISOString(),
            config: {
                ...initialGrid,
            },
        },
    },
};

const userSaveGridsSlice = createSlice({
    name: 'userGrid',
    initialState,
    reducers: {
        persistGridsinLocalStorage(state, action: PayloadAction<number>) {
            state.userId = action.payload;

            const persisted = loadFromLocalStorage(action.payload);
            if (persisted) {
                state.savedGrids = persisted.savedGrids;
            }
        },
        saveInitialGridAsUUID(state) {
            if (!state.userId) return;
            const newLayoutId = uuidv4();
            const initialConfig = state.savedGrids[initialLayoutId].config;
            state.savedGrids[newLayoutId] = {
                layoutId: newLayoutId,
                timestamp: new Date().toISOString(),
                config: { ...initialConfig },
            };
            saveToLocalStorage(state.userId, state);
        },
        updateInitialGrid(
            state,
            action: PayloadAction<{ layoutId: string; key: GridConfigKey; value: string }>,
        ) {
            if (!state.userId) return;
            const { layoutId, key, value } = action.payload;
            if (state.savedGrids[layoutId]) {
                state.savedGrids[layoutId].config[key] = value;
                state.savedGrids[layoutId].timestamp = new Date().toISOString();
                saveToLocalStorage(state.userId, state);
            }
        },
        // ⚡ Redux-State zurücksetzen, persistierte savedGrids bleiben im localStorage
        resetUserGrid(state) {
            state.userId = null;
            state.savedGrids = { ...initialState.savedGrids };
        },
        // not used in development
        loadUserGrids(state, action: PayloadAction<UserSaveGridsState>) {
            state.userId = action.payload.userId;
            state.savedGrids = action.payload.savedGrids;

            if (state.userId) {
                saveToLocalStorage(state.userId, state);
            }
        },
    },
});

export const {
    persistGridsinLocalStorage,
    saveInitialGridAsUUID,
    updateInitialGrid,
    resetUserGrid,
    loadUserGrids,
} = userSaveGridsSlice.actions;
export default userSaveGridsSlice.reducer;
