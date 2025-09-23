import ApiClient from '@/plugins/axios';
import { GridConfig } from '@/types/Redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';

const fetchUserGridsThunk = createAsyncThunk<
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

const saveUserGridThunk = createAsyncThunk<
    GridConfig, // Rückgabe: gespeichertes Grid
    GridConfig, // Argument: das neue Grid
    { state: RootState; rejectValue: string }
>('userGrids/saveUserGrid', async (newGrid: GridConfig, { rejectWithValue }) => {
    try {
        // const state = getState();
        // const userId = state.userGrid.userId;

        // Backend POST
        const response = await ApiClient.post(
            '/grids',
            {
                // userId, // muss nicht übermittelt werden, da im backend in der store method: $grid = Auth::user()->grids()->create($gridData); die userId bekannt ist
                layoutId: newGrid.layoutId,
                name: newGrid.name,
                config: newGrid.config,
                timestamp: newGrid.timestamp,
            },
            { withCredentials: true },
        );

        return response.data.data as GridConfig; // GridResource vom Backend
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Fehler beim Speichern des Grids');
    }
});

const resetUserGridsThunk = createAsyncThunk<
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

const deleteThisGridThunk = createAsyncThunk<
    string, // Rückgabe: layoutId
    string, // Rückgabe: layoutId
    { rejectValue: string }
>('userGrids/deleteThisGrid', async (layoutId: string, { rejectWithValue }) => {
    try {
        await ApiClient.delete(`/grids/by-layout/${layoutId}`, {
            withCredentials: true,
        });
        return layoutId;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || `Fehler beim ${layoutId} Löschen`);
    }
});

export { deleteThisGridThunk, fetchUserGridsThunk, resetUserGridsThunk, saveUserGridThunk };
