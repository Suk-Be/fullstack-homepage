import routes from '@/routes';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes, {
    basename: import.meta.env.VITE_BASENAME,
});

const ReactRouterProvider = () => <RouterProvider router={router} />;

export default ReactRouterProvider;
