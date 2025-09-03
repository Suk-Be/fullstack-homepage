import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectSavedGridsMap = (state: RootState) => state.userGrid.savedGrids;

export const selectSortedGrids = createSelector(
  selectSavedGridsMap, 
  (savedGridsMap) => {
    const savedGridsToArray = Object.values(savedGridsMap);
    const sortCurrentToTop = savedGridsToArray.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return sortCurrentToTop;
  }
);

export const selectInitialGrid = createSelector(
  selectSavedGridsMap,
  (savedGridsMap) => savedGridsMap.initial.config
);

export const selectGridsFromThisUser = createSelector(
  selectSavedGridsMap,
  (savedGridsMap) => {
    // extrahiert die grids aus dem savedGrids Objekt und gibt sie als Einträge in einem neuen Arrays aus
    return Object.values(savedGridsMap);
  }
);



