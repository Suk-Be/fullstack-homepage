import { RouteObject } from 'react-router';

const HomePage = () => <div data-testid="home-page">HomePage</div>;

const mockedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
];

export default mockedRoutes;
