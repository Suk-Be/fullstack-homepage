import { createBrowserRouter } from 'react-router';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'playground', element: <PlaygroundPage /> },
		],
	},
]);

export default router;
