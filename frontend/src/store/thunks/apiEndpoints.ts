export const apiEndpoints = {
    grids: '/grids',
    userGrids: '/user/grids',
    gridByLayout: (layoutId: string) => `/grids/layout/${layoutId}`,
    userReset: (userId: number) => `/users/${userId}/grids`,
};
