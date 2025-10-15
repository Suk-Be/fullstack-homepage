import ApiClient from '@/plugins/axios';
import { RootState } from '@/store';
import { apiEndpoints } from '@/store/thunks/apiEndpoints';
import { GridConfig } from '@/types/Redux';
import { parameterKeys } from '@/utils/recaptcha/parameterKeys';
import getRecaptchaToken from '@/utils/recaptcha/recaptchaToken';
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
        // reCAPTCHA Token holen
        const recaptchaToken = await getRecaptchaToken(parameterKeys.api.saveUserGrid);

        const response = await ApiClient.post(
            apiEndpoints.grids,
            {
                layoutId: newGrid.layoutId,
                name: newGrid.name,
                config: newGrid.config,
                timestamp: newGrid.timestamp,
                recaptcha_token: recaptchaToken, // ⚡ hier das Token mitsenden
            },
            { withCredentials: true },
        );

        return response.data.data as GridConfig;
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
        const recaptchaToken = await getRecaptchaToken(parameterKeys.api.resetUserGrids);
        await ApiClient.delete(apiEndpoints.userReset(userId), {
            data: { recaptcha_token: recaptchaToken },
            withCredentials: true,
        });
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
        const recaptchaToken = await getRecaptchaToken(parameterKeys.api.deleteThisGrid);

        await ApiClient.delete(apiEndpoints.gridByLayout(layoutId), {
            data: { recaptcha_token: recaptchaToken },
            withCredentials: true,
        });
        return layoutId;
    } catch (error: unknown) {
        return rejectWithValue(handleAxiosError(error, `Fehler beim ${layoutId} Löschen`));
    }
});

const renameThisGridThunk = createAsyncThunk<
    { layoutId: string; newName: string },
    { layoutId: string; newName: string },
    { rejectValue: string }
>('userGrids/renameThisGrid', async ({ layoutId, newName }, { rejectWithValue }) => {
    try {
        const recaptchaToken = await getRecaptchaToken(parameterKeys.api.renameThisGrid);

        const response = await ApiClient.patch(
            apiEndpoints.gridByLayout(layoutId),
            { name: newName, recaptcha_token: recaptchaToken },
            { withCredentials: true },
        );

        if (!response?.data?.data) return { layoutId, newName };

        const updated = response.data.data;
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
