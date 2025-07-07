import { RouteObject } from 'react-router';
import App from './App';
import DatenschutzPage from './pages/DatenschutzPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SocialiteCallbackPage from './pages/SocialiteCallbackPage';

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
        // http://localhost:5173/auth/callback
        path: '/auth/callback',
        element: <SocialiteCallbackPage />,
    },
];

export default routes;
