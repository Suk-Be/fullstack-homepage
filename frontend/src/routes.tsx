import { RouteObject } from 'react-router';
import App from './App';
import AuthCallback from './components/auth/shared-components/AuthCallback';
import DatenschutzPage from './pages/DatenschutzPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
            { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
    },
    {
        // Socialite callback routes for github, google
        path: '/auth/callback',
        element: <AuthCallback />,
    },
];

export default routes;
