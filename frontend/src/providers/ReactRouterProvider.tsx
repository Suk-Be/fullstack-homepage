import { RouterProvider, createBrowserRouter } from 'react-router';
import routes from '../routes';

const router = createBrowserRouter(routes);

const ReactRouterProvider = () => <RouterProvider router={router} />;

export default ReactRouterProvider;
