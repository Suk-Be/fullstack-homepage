import { mockLogInState } from '@/tests/mocks/redux';
import { setupStore } from '@/tests/utils/testRenderUtils';
import AppThemeProvider from '@/themes/AppTheme';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/utils/isProd', () => ({
    isProd: vi.fn(),
}));
vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useRouteError: vi.fn(),
        isRouteErrorResponse: vi.fn(),
    };
});

import ErrorPage from '@/pages/ErrorPage';
import { isProd } from '@/utils/isProd';
import * as ReactRouter from 'react-router-dom';

/**
 * renderErrorPage()
 *
 * Unit-test renderer for <ErrorPage />.
 * - Provides Redux store (using your existing mockLogInState)
 * - Provides AppThemeProvider (so components that rely on theme don't crash)
 * - No RouterProvider needed, because we mock router hooks (useRouteError, isRouteErrorResponse)
 */
function renderErrorPage() {
    const store = setupStore(mockLogInState);
    return render(
        <ReduxProvider store={store}>
            <AppThemeProvider>
                <ErrorPage />
            </AppThemeProvider>
        </ReduxProvider>,
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    // default: development-like behavior
    vi.mocked(isProd).mockReturnValue(false);
});

describe('ErrorPage', () => {
    it('renders router error with errorMessage in development mode', async () => {
        (ReactRouter.useRouteError as Mock).mockReturnValue({
            status: 404,
            statusText: 'Not Found',
        });
        (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(true);

        renderErrorPage();

        expect(await screen.findByText(/Seite nicht gefunden/i)).toBeInTheDocument();
        expect(screen.getByText(/Router Status: 404 - Not Found/i)).toBeInTheDocument();
    });

    it('renders JS error with errorMessage in development mode', async () => {
        (ReactRouter.useRouteError as Mock).mockReturnValue(new Error('Unexpected failure'));
        (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

        renderErrorPage();

        expect(await screen.findByText(/Seite nicht gefunden/i)).toBeInTheDocument();
        expect(screen.getByText(/JS Error: Unexpected failure/i)).toBeInTheDocument();
    });

    it('renders fallback message if no error is provided', async () => {
        (ReactRouter.useRouteError as Mock).mockReturnValue(null);
        (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

        renderErrorPage();

        expect(await screen.findByText(/Seite nicht gefunden/i)).toBeInTheDocument();
        expect(screen.getByText(/Unknown error occurred/i)).toBeInTheDocument();
    });

    it('hides router error detail message in production mode', async () => {
        vi.mocked(isProd).mockReturnValue(true);

        (ReactRouter.useRouteError as Mock).mockReturnValue({
            status: 404,
            statusText: 'Not Found',
        });
        (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(true);

        renderErrorPage();

        expect(await screen.findByText(/Seite nicht gefunden/i)).toBeInTheDocument();
        expect(screen.queryByText(/Router Status:/i)).not.toBeInTheDocument();
    });

    it('hides error message in production mode', async () => {
        vi.mocked(isProd).mockReturnValue(true);

        (ReactRouter.useRouteError as Mock).mockReturnValue(new Error('Production error'));
        (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

        renderErrorPage();

        expect(await screen.findByText(/Seite nicht gefunden/i)).toBeInTheDocument();
        expect(screen.queryByText(/JS Error: Production error/i)).not.toBeInTheDocument();
    });
});
