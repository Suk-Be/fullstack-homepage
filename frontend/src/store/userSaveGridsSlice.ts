import { GridConfig, GridConfigKey, UserSaveGridsState } from '@/types/Redux';
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
        setUserIdForGrids(state, action: PayloadAction<number>) {
            state.userId = action.payload;
        },
        addGrid(state, action: PayloadAction<Omit<GridConfig, 'layoutId' | 'timestamp'>>) {
            const newLayoutId = uuidv4();
            state.savedGrids[newLayoutId] = {
                layoutId: newLayoutId,
                timestamp: new Date().toISOString(),
                ...action.payload,
            };
        },
        updateGrid(
            state,
            action: PayloadAction<{ layoutId: string; key: GridConfigKey; value: string }>,
        ) {
            const { layoutId, key, value } = action.payload;
            if (state.savedGrids[layoutId]) {
                state.savedGrids[layoutId].config[key] = value;
                state.savedGrids[layoutId].timestamp = new Date().toISOString();
            }
        },
        resetUserGrid() {
            return initialState;
        },
    },
});

export const { setUserIdForGrids, addGrid, updateGrid, resetUserGrid } = userSaveGridsSlice.actions;
export default userSaveGridsSlice.reducer;
