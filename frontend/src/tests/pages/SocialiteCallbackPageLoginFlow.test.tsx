import SocialiteCallbackPage from '@/pages/SocialiteCallbackPage';
import { login, setUserId } from '@/store/loginSlice';
import { mockReduxLoggedInState } from '@/tests/mocks/redux';
import { renderWithProvidersDOM } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/dom';
import { describe, vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockDispatch = vi.hoisted(() => vi.fn());
vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

describe('SocialiteCallbackPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call login flow on success', async () => {
        renderWithProvidersDOM(<SocialiteCallbackPage />, {
            route: '/auth/callback',
            preloadedState: mockReduxLoggedInState,
        });
        const mockedUserId = 1;

        expect(screen.getByText(/anmelde prozess/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(login());
            expect(mockDispatch).toHaveBeenCalledWith(setUserId(mockedUserId));
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
