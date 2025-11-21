import { RootState } from '@/store';
import { initialGridConfig, initialLayoutId } from '@/store/userSaveGridsSlice';
import { createSelector } from '@reduxjs/toolkit';

const selectSavedGridsMap = (state: RootState) => state.userGrid.savedGrids;

const selectSortedGrids = createSelector(selectSavedGridsMap, (savedGridsMap) => {
    const savedGridsToArray = Object.values(savedGridsMap);

    // filtere "initialLayoutId" raus
    const withoutInitial = savedGridsToArray.filter((grid) => grid.layoutId !== 'initialLayoutId');

    // sortiere nach timestamp (neueste oben)
    return withoutInitial.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
});

const selectInitialGrid = createSelector(
    selectSavedGridsMap,
    (savedGridsMap) => savedGridsMap[initialLayoutId].config,
);

const selectNewGrid = createSelector(
    selectSavedGridsMap,
    (savedGridsMap) => savedGridsMap[initialLayoutId]?.config ?? { ...initialGridConfig },
);

const selectGridsFromThisUser = (state: RootState) => state.userGrid.savedGrids;

export {
    selectGridsFromThisUser,
    selectInitialGrid,
    selectNewGrid,
    selectSavedGridsMap,
    selectSortedGrids,
};
