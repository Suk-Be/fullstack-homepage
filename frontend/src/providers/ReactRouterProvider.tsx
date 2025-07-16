import routes from '@/routes';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter(routes);

const ReactRouterProvider = () => <RouterProvider router={router} />;

export default ReactRouterProvider;
