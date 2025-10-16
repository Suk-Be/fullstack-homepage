// src/routes.tsx
import App from '@/App';
import Loading from '@/components/auth/shared-components/Loading';
import ProtectedApp from '@/ProtectedApp';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router';

// Dynamische Imports aller Seiten im /pages Ordner
const pages = import.meta.glob('./pages/*.tsx');

// Helper zum Lazy-Load einer Page
const lazyPage = (path: string, message?: string) => {
    const loader = pages[`./pages/${path}.tsx`];
    if (!loader) throw new Error(`Page not found: ${path}`);
    const Component = lazy(
        loader as () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    );
    return (
        <Suspense fallback={<Loading message={message ?? 'Lade Seite ...'} />}>
            <Component />
        </Suspense>
    );
};

// --- Routen-Hierarchie ---
const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />, // enthält Layout mit <Outlet />
        errorElement: lazyPage('ErrorPage', 'Fehlerseite wird geladen ...'),
        children: [
            { index: true, element: lazyPage('HomePage', 'Startseite wird geladen ...') },
            { path: 'impressum', element: lazyPage('ImprintPage') },
            { path: 'datenschutz', element: lazyPage('DatenschutzPage') },
            { path: 'reset-password', element: lazyPage('ResetPasswordPage') },
            {
                element: <ProtectedApp />, // Auth-Check hier
                children: [
                    { path: 'template-engine', element: lazyPage('ProjectTemplateEnginePage') },
                    {
                        path: 'template-engine/presets',
                        element: lazyPage('ProjectTemplateEngineLayoutExamplesPage'),
                    },
                ],
            },
            { path: 'not-logged-in', element: lazyPage('NotLoggedInPage') },
        ],
    },
    {
        // z. B. http://localhost:5173/auth/callback
        path: '/auth/callback',
        element: lazyPage('SocialiteCallbackPage'),
    },
    {
        path: '*',
        element: lazyPage('NotFoundPage'),
    },
];

export default routes;
