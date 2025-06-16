import { RouteObject } from 'react-router';
import App from './App';
import AuthCallback from './components/auth/components/AuthCallback';
import DatenschutzPage from './pages/DatenschutzPage';
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
            { path: 'datenschutz', element: <DatenschutzPage /> },
        ],
    },
    {
        path: '/auth/callback',
        element: <AuthCallback />,
    },
];

export default routes;
