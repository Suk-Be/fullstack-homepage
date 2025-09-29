import { RouteObject } from 'react-router';
/* eslint-disable react-refresh/only-export-components */
const HomePage = () => <div data-testid="home-page">HomePage</div>;

const mockedRoutes: RouteObject[] = [
    {
        path: '/',
        element: <HomePage />,
    },
];

export default mockedRoutes;
