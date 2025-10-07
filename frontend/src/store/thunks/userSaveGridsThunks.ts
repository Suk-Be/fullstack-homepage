import ApiClient from '@/plugins/axios';
import { RootState } from '@/store';
import { apiEndpoints } from '@/store/thunks/apiEndpoints';
import { GridConfig } from '@/types/Redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

function handleAxiosError(error: unknown, fallback: string) {
    let message = fallback;

    if ((error as AxiosError<{ message: string }>).isAxiosError) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
            message = axiosError.response.data.message;
        }
    }

    return message;
}

const fetchUserGridsThunk = createAsyncThunk<
    Record<string, GridConfig>, // Rückgabe vom Backend: keyed Object
    number, // userId als Argument
    { rejectValue: string }
>('userGrids/fetchUserGrids', async (_userId, { rejectWithValue }) => {
    console.log('👉 fetchUserGridsThunk gestartet mit userId', _userId);
    try {
        const response = await ApiClient.get(apiEndpoints.userGrids, { withCredentials: true });
        // payload ist jetzt ein Object keyed by layoutId
        return response.data.data;
    } catch (error: unknown) {
        return rejectWithValue(handleAxiosError(error, 'Fehler beim Laden der Grids'));
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
            apiEndpoints.grids,
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
    } catch (error: unknown) {
        return rejectWithValue(handleAxiosError(error, 'Fehler beim Speichern der Grids'));
    }
});

/* This code block defines a Redux thunk function named `resetUserGridsThunk`. */
const resetUserGridsThunk = createAsyncThunk<
    number, // Rückgabe: userId
    number, // Argument: userId
    { rejectValue: string }
>('userGrids/resetUserGrids', async (userId: number, { rejectWithValue }) => {
    try {
        await ApiClient.delete(apiEndpoints.userReset(userId), { withCredentials: true });
        return userId; // action.payload
    } catch (error: unknown) {
        return rejectWithValue(handleAxiosError(error, `Fehler beim ${userId} Zurücksetzen`));
    }
});

const deleteThisGridThunk = createAsyncThunk<
    string, // Rückgabe: layoutId
    string, // Rückgabe: layoutId
    { rejectValue: string }
>('userGrids/deleteThisGrid', async (layoutId: string, { rejectWithValue }) => {
    try {
        await ApiClient.delete(apiEndpoints.gridByLayout(layoutId), {
            withCredentials: true,
        });
        return layoutId;
    } catch (error: unknown) {
        return rejectWithValue(handleAxiosError(error, `Fehler beim ${layoutId} Löschen`));
    }
});

const renameThisGridThunk = createAsyncThunk<
    { layoutId: string; newName: string }, // Rückgabe
    { layoutId: string; newName: string }, // Argument
    { rejectValue: string }
>('userGrids/renameThisGrid', async ({ layoutId, newName }, { rejectWithValue }) => {
    try {
        // PATCH to backend route defined in api.php
        const response = await ApiClient.patch(
            apiEndpoints.gridByLayout(layoutId),
            { name: newName },
            { withCredentials: true },
        );

        // Server gibt GridResource zurück → kann ggf. direkt genutzt werden
        if (!response?.data?.data) {
            return { layoutId, newName };
        }

        const updated = response.data.data as GridConfig;
        return { layoutId, newName: updated.name || newName };
    } catch (error) {
        return rejectWithValue(
            handleAxiosError(error, 'Fehler beim Umbenennen der Grid-Konfiguration.'),
        );
    }
});

export {
    deleteThisGridThunk,
    fetchUserGridsThunk,
    renameThisGridThunk,
    resetUserGridsThunk,
    saveUserGridThunk,
};
