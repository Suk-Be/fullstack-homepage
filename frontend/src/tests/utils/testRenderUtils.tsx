import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { delay, http, HttpResponse } from 'msw';
import React, { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { MemoryRouter, Router } from 'react-router-dom';
import routes from '../../routes';
import type { RootState } from '../../store';
import layoutSlice from '../../store/layoutSlice';
import loginSlice from '../../store/loginSlice';
import AppThemeProvider from '../../themes/AppTheme';
import apiBaseUrl from '../../utils/apiBaseUrl';
import { server } from '../mocks/server';

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
        uri: `${apiBaseUrl()}/auth/github`,
    },
    {
        provider: 'Google',
        uri: `${apiBaseUrl()}/auth/google`,
    },
];

const rootReducer = combineReducers({
    login: loginSlice,
    layout: layoutSlice,
});

type PreloadedState<T> = Partial<T> | {};

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

/**
 * Useful for mocking navigating pages
 * @param route
 * @param preloadedState any state from RootState can be mocked
 * @returns a testable page with state data passes in
 *
 * example: navigateTo('/', { login: { isLoggedIn: true } })
 * renders HomePage with login status (isLoggedIn: true)
 */

export type PathAndReduxState = {
    route?: string;
    preloadedState?: PreloadedState<RootState>;
};

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

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter initialEntries={[route]}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {ui}
                </ThemeProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

/**
 * Verify that a called route has not changed
 * e.g.
 * it('should use the protected route (if logged in)', async () => {
 *       const { history } = testRenderWithProviders(<ProtectedApp />, {
 *         route: '/template-engine',
 *         preloadedState: {
 *           login: { isLoggedIn: true },
 *         },
 *       });
 * 
 *       await waitFor(() => {
 *         expect(history.location.pathname).toBe('/template-engine');
 *       });
 *     });
 */


const renderRouteHasNotChanged = (
  ui: React.ReactElement,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
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
}


export { authProviderUrls, navigateTo, renderRouteHasNotChanged, renderWithProviders, simluateDelay, simulateError };

