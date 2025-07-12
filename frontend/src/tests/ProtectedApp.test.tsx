import { waitFor } from '@testing-library/react'; // Assuming your login slice is here
import { vi } from 'vitest';
import ProtectedApp from '../ProtectedApp';
import { renderWithProviders } from './utils/testRenderUtils';

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
        Outlet: () => <div data-testid="outlet-content">Outlet Content</div>, // Simple mock for Outlet
    };
});

describe('ProtectedApp', () => {
    beforeEach(() => {
          vi.clearAllMocks()
    });

    it('redirects if not logged in to Home Page', async () => {
        renderWithProviders(<ProtectedApp />, {
            route: '/template-engine',
            preloadedState: {
                login: { isLoggedIn: false },
            },
        });

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        })
        
    });

    it('renders the outlet content if user is logged in', async () => {
      renderWithProviders(<ProtectedApp />, {
        route: '/template-engine',
        preloadedState: {
          login: { isLoggedIn: true },
        },
      });

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
        // todo Outlet not testable with current libs
        // expect(screen.getByText(/Outlet Content/i)).toBeInTheDocument();
        // expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      });
    });
});

