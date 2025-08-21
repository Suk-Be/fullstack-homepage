import { RouteObject } from 'react-router';
import App from './App';
import DatenschutzPage from './pages/DatenschutzPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import NotFoundPage from './pages/NotFoundPage';
import NotLoggedInPage from './pages/NotLoggedInPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ProjectTemplateEnginePresetsPage from './pages/ProjectTemplateEngineLayoutExamplesPage';
import ProjectTemplateEnginePage from './pages/ProjectTemplateEnginePage';
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
                    {
                        path: 'template-engine/presets',
                        element: <ProjectTemplateEnginePresetsPage />,
                    },
                    { path: 'playground', element: <PlaygroundPage /> },
                ],
            },
            { path: 'not-logged-in', element: <NotLoggedInPage /> },
        ],
    },
    {
        // http://localhost:5173/auth/callback
        path: '/auth/callback',
        element: <SocialiteCallbackPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export default routes;
