import { render } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from '../routes';
import { default as ThemeProvider } from '../themes/AppTheme';
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

/**
 * TestUtility
 * Creates MemoryRouter with Mui ThemeProvider and RouterProvider
 * @param entryPath
 * @returns a testable page for the entry path (url)
 *
 * example: navigateTo('/') renders the HomePage
 */
const navigateTo = (entryPath: string) => {
    const router = createMemoryRouter(routes, { initialEntries: [entryPath] });
    return render(
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>,
    );
};

export { navigateTo, simluateDelay, simulateError };
