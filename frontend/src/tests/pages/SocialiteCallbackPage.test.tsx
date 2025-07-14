
const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

import { screen, waitFor } from '@testing-library/dom';
import { describe, vi } from 'vitest';
import SocialiteCallbackPage from '../../pages/SocialiteCallbackPage';
import { login } from '../../store/loginSlice';
import { mockReduxLoggedInState } from '../mocks/redux';
import { renderWithProvidersReactRouterDOM } from '../utils/testRenderUtils';

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
