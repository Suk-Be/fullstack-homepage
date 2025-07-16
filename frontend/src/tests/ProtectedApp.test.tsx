import ProtectedApp from '@/ProtectedApp';
import { waitFor } from '@testing-library/react'; // Assuming your login slice is here
import { vi } from 'vitest';
import { renderWithProviders, renderWithProvidersReactRouterDOM } from './utils/testRenderUtils';

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

    it('should redirect to Home Page (if not logged in)', async () => {
        renderWithProviders(<ProtectedApp />, {
            route: '/template-engine',
            preloadedState: {
                login: { isLoggedIn: false },
            },
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(window.location.pathname).toBe('/');
        });
    });

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
});
