import { login } from '@/store/loginSlice';
import { mockReduxLoggedInState } from '@/tests/mocks/redux';
import { renderWithProvidersReactRouterDOM } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/dom';
import { describe, vi } from 'vitest';
import SocialiteCallbackPage from '../../pages/SocialiteCallbackPage';

const mockDispatch = vi.hoisted(() => vi.fn());

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

describe('SocialiteCallbackPage', () => {
    it('should render the SocialiteCallbackPage', async () => {
        renderWithProvidersReactRouterDOM(<SocialiteCallbackPage />, {
            route: '/auth/callback',
            preloadedState: mockReduxLoggedInState,
        });

        expect(screen.getByText(/logging in/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(login());
        });
    });
});
