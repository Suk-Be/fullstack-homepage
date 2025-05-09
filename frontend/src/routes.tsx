import { RouteObject } from 'react-router';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import PlaygroundPage from './pages/PlaygroundPage';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'playground', element: <PlaygroundPage /> },
            { path: 'impressum', element: <ImprintPage /> },
        ],
    },
];

export default routes;
