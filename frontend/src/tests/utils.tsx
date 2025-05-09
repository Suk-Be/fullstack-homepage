import { render } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from '../routes';
import { server } from './mocks/server';

const simluateDelay = (endpoint: string) =>
    server.use(
        http.get(endpoint, async () => {
            await delay();
            return HttpResponse.json([]);
        }),
    );

const simulateError = (endpoint: string) =>
    server.use(
        http.get(endpoint, () => {
            return HttpResponse.error();
        }),
    );

const navigateTo = (entryPath: string) => {
    const router = createMemoryRouter(routes, { initialEntries: [entryPath] });
    render(<RouterProvider router={router} />);
};

export { navigateTo, simluateDelay, simulateError };
