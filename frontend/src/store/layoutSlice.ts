import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hasBorders: false,
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        hasBorders: (state) => {
            state.hasBorders = true;
        },
        hasNoBorders: (state) => {
            state.hasBorders = false;
        },
    },
});

export const { hasBorders, hasNoBorders } = layoutSlice.actions;
export default layoutSlice.reducer;
