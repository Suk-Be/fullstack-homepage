import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import ErrorMessages from '../data/ErrorMessages';
import routes from '../routes';
import AppThemeProvider from '../themes/AppTheme';
import apiBaseUrl from '../utils/apiBaseUrl';
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

const authProviderUrls = [
    {
        provider: 'GitHub',
        uri: `${apiBaseUrl}/auth/github`,
    },
    {
        provider: 'Google',
        uri: `${apiBaseUrl}/auth/google`,
    },
];

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
        <AppThemeProvider>
            <RouterProvider router={router} />
        </AppThemeProvider>,
    );
};

/**
 * Renders a React component wrapped with necessary providers for testing.
 *
 * This includes:
 * - `MemoryRouter` for simulating routing with React Router
 * - `ThemeProvider` and `CssBaseline` from MUI for consistent styling
 *
 * It also sets the browser's history to the specified route so that
 * components relying on routing behave as expected.
 *
 * @param {React.ReactElement} ui - The React component to render.
 * @param {Object} [options] - Optional render options.
 * @param {string} [options.route='/'] - Initial route for MemoryRouter and history.
 *
 * @returns {ReturnType<typeof import('@testing-library/react').render>} - The result of RTL's render function, including query utilities.
 *
 * @example
 * renderWithProviders(<MyComponent />);
 *
 * @example
 * renderWithProviders(<MyComponent />, { route: '/dashboard' });
 */

const theme = createTheme(); // or your custom theme

type RenderOptions = {
    route?: string;
};

const renderWithProviders = (ui: React.ReactElement, { route = '/' }: RenderOptions = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(
        <MemoryRouter initialEntries={[route]}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {ui}
            </ThemeProvider>
        </MemoryRouter>,
    );
};

/**
 * Asserts that specific error messages for a given form type (SignUp or SignIn)
 * are rendered in the document.
 *
 * @template T - Either 'SignUp' or 'SignIn'
 * @param {T} formType - The form section to check error messages for (e.g., 'SignUp')
 * @param {Array<keyof typeof ErrorMessages[T]>} fields - The fields whose error messages should be present
 *
 * @example
 * expectErrorMessages('SignUp', ['email', 'password']);
 */
const expectErrorMessages = <T extends 'SignUp' | 'SignIn'>(
    formType: T,
    fields: Array<keyof (typeof ErrorMessages)[T]>,
) => {
    fields.forEach((field) => {
        expect(screen.getByText(ErrorMessages[formType][field] as string)).toBeInTheDocument();
    });
};

/**
 * Asserts that specific error messages for a given form type (SignUp or SignIn)
 * are **not** rendered in the document.
 *
 * @template T - Either 'SignUp' or 'SignIn'
 * @param {T} formType - The form section to check error messages for (e.g., 'SignUp')
 * @param {Array<keyof typeof ErrorMessages[T]>} fields - The fields whose error messages should not be present
 *
 * @example
 * expectNoErrorMessages('SignIn', ['email', 'password']);
 */
const expectNoErrorMessages = <T extends 'SignUp' | 'SignIn'>(
    formType: T,
    fields: Array<keyof (typeof ErrorMessages)[T]>,
) => {
    fields.forEach((field) => {
        expect(
            screen.queryByText(ErrorMessages[formType][field] as string),
        ).not.toBeInTheDocument();
    });
};

export {
    authProviderUrls,
    expectErrorMessages,
    expectNoErrorMessages,
    navigateTo,
    renderWithProviders,
    simluateDelay,
    simulateError,
};
