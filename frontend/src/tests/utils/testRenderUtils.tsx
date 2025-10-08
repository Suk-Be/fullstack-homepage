import routes from '@/routes';
import type { RootState } from '@/store';
import loginReducer from '@/store/loginSlice';
import userSaveGridsReducer from '@/store/userSaveGridsSlice';
import { server } from '@/tests/mocks/server';
import AppThemeProvider from '@/themes/AppTheme';
import { baseUrl } from '@/utils/apiBaseUrl';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render, renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { delay, http, HttpResponse } from 'msw';
import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { MemoryRouter, Router } from 'react-router-dom';

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
        uri: `${baseUrl()}/auth/github`,
    },
    {
        provider: 'Google',
        uri: `${baseUrl()}/auth/google`,
    },
];

const rootReducer = combineReducers({
    login: loginReducer,
    userGrid: userSaveGridsReducer,
});

type PreloadedState = Partial<RootState>;

export const setupStore = (preloadedState?: PreloadedState) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

/**
 * Useful for mocking navigating pages
 * It uses RouterProvider from react-router, that uses a MenoryRouter for testing purposes
 * @param route
 * @param preloadedState any state from RootState can be mocked
 * @returns a testable page with state data passes in
 *
 * example: navigateTo('/', { login: { isLoggedIn: true } })
 * renders HomePage with login status (isLoggedIn: true)
 */

export interface PathAndReduxState {
    route?: string;
    preloadedState?: PreloadedState;
}

const navigateTo = ({ route = '/', preloadedState = {} }: PathAndReduxState) => {
    const store = setupStore(preloadedState);
    const router = createMemoryRouter(routes, { initialEntries: [route] });
    return render(
        <ReduxProvider store={store}>
            <AppThemeProvider>
                <RouterProvider router={router} />
            </AppThemeProvider>
        </ReduxProvider>,
    );
};

/**
 * Renders a React component wrapped with necessary providers for testing.
 * It uses MemoryRouter from react-router for checking router internals
 *
 * @param {React.ReactElement} ui - The React component to render.
 * @param preloadedState any state from RootState can be mocked
 *
 * @example
 * renderWithProviders(<MyDashboard />, { route: '/dashboard', preloadedState: { user: { name: 'John Doe' } } });
 */

const theme = createTheme(); // or your custom theme

const renderWithProviders = (
    ui: React.ReactElement,
    { route = '/', preloadedState }: PathAndReduxState = {},
) => {
    const store = setupStore(preloadedState);

    // window.history.pushState({}, 'Test page', route);

    return {
        store,
        ...render(
            <ReduxProvider store={store}>
                <MemoryRouter initialEntries={[route]}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {ui}
                    </ThemeProvider>
                </MemoryRouter>
            </ReduxProvider>,
        ),
    };
};

/**
 * Is used occasionally: only useful for route testing with browser routing
 * It uses router from react-router-dom, it gives control over the browser url
 * e.g. testing that a callback url for github registration is called
  it('should render the SocialiteCallbackPage', async () => {
    renderWithProvidersReactRouterDOM(<SocialiteCallbackPage />, {
      route: '/auth/callback',
      preloadedState: mockLogInState,
    });

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(login());
    });
  });
  
 * e.g. checking if protected route is called if logged in
  it('should use the protected route (if logged in)', async () => {
      const { history } = renderWithProvidersReactRouterDOM(<ProtectedApp />, {
        route: '/template-engine',
        preloadedState: {
          login: { isLoggedIn: true },
        },
      });

      await waitFor(() => {
        // history.location.pathname verifies that route did not change
        expect(history.location.pathname).toBe('/template-engine');
      });
    });
 */

const renderWithProvidersDOM = (
    ui: React.ReactElement,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = {},
) => {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <ReduxProvider store={store}>
                <Router location={history.location} navigator={history}>
                    {children}
                </Router>
            </ReduxProvider>
        );
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        history,
    };
};

const renderHookWithProviders = <
    Result,
    Props extends Record<string, unknown> = {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
>(
    hook: (props: Props) => Result,
    {
        preloadedState,
        route = '/',
        initialProps,
        store = setupStore(preloadedState),
        ...options
    }: {
        preloadedState?: Partial<RootState>;
        route?: string;
        initialProps?: Props;
        store?: ReturnType<typeof setupStore>;
    } & Omit<RenderHookOptions<Props>, 'wrapper'> = {}, // eslint-disable-line @typescript-eslint/no-empty-object-type
): RenderHookResult<Result, Props> => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <ReduxProvider store={store}>
            <MemoryRouter initialEntries={[route]}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </MemoryRouter>
        </ReduxProvider>
    );

    return renderHook(hook, { wrapper: Wrapper, initialProps, ...options });
};

export {
    authProviderUrls,
    navigateTo,
    renderHookWithProviders,
    renderWithProviders,
    renderWithProvidersDOM,
    simluateDelay,
    simulateError,
};
