import { UserSaveGridsState } from '@/types/Redux';

const localStorageKeyPrefix = 'userGrid_';

export const saveToLocalStorage = (userId: number, sliceState: UserSaveGridsState) => {
    try {
        const storage = {
            savedGrids: sliceState.savedGrids,
        };
        localStorage.setItem(localStorageKeyPrefix + userId, JSON.stringify(storage));
    } catch (err) {
        console.error('Failed to save grids to localStorage', err);
    }
};

export const loadFromLocalStorage = (userId: number): UserSaveGridsState | null => {
    try {
        const raw = localStorage.getItem(localStorageKeyPrefix + userId);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                userId,
                savedGrids: parsed.savedGrids ?? {},
            };
        }
        return null;
    } catch (err) {
        console.error('Failed to load grids from localStorage', err);
        return null;
    }
};
