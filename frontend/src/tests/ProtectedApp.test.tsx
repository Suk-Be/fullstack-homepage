import ProtectedApp from '@/ProtectedApp';
import { screen, waitFor } from '@testing-library/react'; // Assuming your login slice is here
import { vi } from 'vitest';
import { renderWithProviders, renderWithProvidersDOM } from './utils/testRenderUtils';

const { mockDispatch, mockNavigate } = vi.hoisted(() => {
    return {
        mockDispatch: vi.fn(),
        mockNavigate: vi.fn(),
    };
});

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-redux')>();
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        Navigate: (props: any) => {
            mockNavigate(props.to);
            return null; // Don't render anything when Navigate is called
        },
    };
});

describe('ProtectedApp', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show a loading indicator on load', async () => {
        renderWithProviders(<ProtectedApp />, {
            route: '/template-engine',
            preloadedState: {
                login: { isLoggedIn: false, isLoading: true },
            },
        });

        expect(screen.getByText(/überprüfung der authentifizierung/i)).toBeInTheDocument();
    });

    // logic for setting login state can be found in useAuthInit.ts which used by provider auth initializer
    it('should redirect to a Not Logged In Page (if not logged in and not active session cookie is found)', async () => {
        renderWithProviders(<ProtectedApp />, {
            route: '/template-engine',
            preloadedState: {
                login: { isLoggedIn: false, isLoading: false },
            },
        });

        await waitFor(() => {
            expect(screen.getByText(/willkommen zurück/i)).toBeInTheDocument();
            expect(screen.getByText(/um diese seite nutzen zu können/i)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /zur startseite/i })).toBeInTheDocument();
        });
    });

    it('should use the protected route (if logged in)', async () => {
        const { history } = renderWithProvidersDOM(<ProtectedApp />, {
            route: '/template-engine',
            preloadedState: {
                login: { isLoggedIn: true, isLoading: false },
            },
        });

        await waitFor(() => {
            // history.location.pathname verifies that route did not change
            expect(history.location.pathname).toBe('/template-engine');
        });
    });
});
