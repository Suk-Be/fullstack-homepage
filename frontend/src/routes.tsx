import { RouteObject } from 'react-router';
import App from './App';
import DatenschutzPage from './pages/DatenschutzPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ProjectTemplateEnginePage from './pages/ProjectTemplateEnginePage';
import ProjectTestPage from './pages/ProjectTestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SocialiteCallbackPage from './pages/SocialiteCallbackPage';
import ProtectedApp from './ProtectedApp';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'impressum', element: <ImprintPage /> },
            { path: 'datenschutz', element: <DatenschutzPage /> },
            { path: 'reset-password', element: <ResetPasswordPage /> },
            {
                element: <ProtectedApp />,
                children: [
                    { path: 'template-engine', element: <ProjectTemplateEnginePage /> },
                    { path: 'playground', element: <PlaygroundPage /> },
                    { path: 'test-another-project', element: <ProjectTestPage /> },
                ],
            },
        ],
    },
    {
        // http://localhost:5173/auth/callback
        path: '/auth/callback',
        element: <SocialiteCallbackPage />,
    },
];

export default routes;
