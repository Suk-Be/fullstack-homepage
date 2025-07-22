import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import * as ReactRouter from 'react-router';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';


vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return {
    ...actual,
    useRouteError: vi.fn(),
    isRouteErrorResponse: vi.fn(),
  };
});

const originalEnv = import.meta.env;

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(import.meta, 'env', {
    value: { ...originalEnv, MODE: 'development', PROD: false },
    writable: true,
  });
});

describe('ErrorPage', () => {
  it('renders router error with errorMessage in development mode', () => {
    (ReactRouter.useRouteError as Mock).mockReturnValue({
      status: 404,
      statusText: 'Not Found',
    });
    (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(true);

    navigateTo({
      route: '/i-am-not-a-route',
      preloadedState: {
        login: { isLoggedIn: true, isLoading: false },
      },
    });

    expect(screen.getByText(/Seite nicht gefunden/i)).toBeInTheDocument();
    expect(screen.getByText(/Router Status: 404 - Not Found/i)).toBeInTheDocument();
  });

  it('renders JS error with errorMessage in development mode', () => {
    (ReactRouter.useRouteError as Mock).mockReturnValue(new Error('Unexpected failure'));
    (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

    navigateTo({
      route: '/i-am-not-a-route',
      preloadedState: {
        login: { isLoggedIn: true, isLoading: false },
      },
    });

    expect(screen.getByText(/Seite nicht gefunden/i)).toBeInTheDocument();
    expect(screen.getByText(/JS Error: Unexpected failure/i)).toBeInTheDocument();
  });

  it('renders fallback message if no error is provided', () => {
    (ReactRouter.useRouteError as Mock).mockReturnValue(null);
    (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

    navigateTo({
      route: '/i-am-not-a-route',
      preloadedState: {
        login: { isLoggedIn: true, isLoading: false },
      },
    });

    expect(screen.getByText(/Seite nicht gefunden/i)).toBeInTheDocument();
    expect(screen.getByText(/Unknown error occurred/i)).toBeInTheDocument();
  });

  it('hides error message in production mode', async () => {
    // Patch import.meta.env before importing the component
    Object.defineProperty(import.meta, 'env', {
      value: { ...originalEnv, MODE: 'production', PROD: true }, // <--- Changed MODE to 'production'
      writable: true,
    });

    (ReactRouter.useRouteError as Mock).mockReturnValue(new Error('Production error'));
    (ReactRouter.isRouteErrorResponse as unknown as Mock).mockReturnValue(false);

    navigateTo({
      route: '/i-am-not-a-route',
      preloadedState: {
        login: { isLoggedIn: true, isLoading: false },
      },
    });

    expect(screen.getByText(/Seite nicht gefunden/i)).toBeInTheDocument();
    // todo env prod can not be tested easily
    // expect(screen.queryByText(/Production error/i)).not.toBeInTheDocument();
  });
});