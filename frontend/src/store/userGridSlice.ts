import { GridConfig, UserGridState } from '@/types/Redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState: UserGridState = {
    userId: null,
    savedGrids: {},
};

const userGridSlice = createSlice({
    name: 'userGrid',
    initialState,
    reducers: {
        addGrid(state, action: PayloadAction<Omit<GridConfig, 'layoutId' | 'timestamp'>>) {
            const newLayoutId = uuidv4();
            state.savedGrids[newLayoutId] = {
                layoutId: newLayoutId,
                timestamp: new Date().toISOString(),
                ...action.payload,
            };
        },
        resetUserGrid() {
            return initialState;
        },
    },
});

export const { addGrid, resetUserGrid } = userGridSlice.actions;
export default userGridSlice.reducer;
