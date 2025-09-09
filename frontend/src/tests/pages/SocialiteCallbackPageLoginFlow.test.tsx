import SocialiteCallbackPage from '@/pages/SocialiteCallbackPage';
import { BaseClient } from '@/plugins/axios';
import { forceLogin } from '@/store/loginSlice';
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

vi.mock('@/plugins/axios', () => ({
    default: {
        get: vi.fn(),
    },
    BaseClient: { get: vi.fn() }
}));

describe('SocialiteCallbackPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call login flow on success', async () => {
        const mockedUserId = 1;

        vi.spyOn(BaseClient, 'get').mockImplementation((url: string) => {
            if (url === '/csrf-cookie') return Promise.resolve({});
            if (url === '/me') return Promise.resolve({ data: { id: mockedUserId } });
            return Promise.reject(new Error('Unknown url'));
        });

        renderWithProvidersDOM(<SocialiteCallbackPage />, {
            route: '/auth/callback',
            preloadedState: mockReduxLoggedInState,
        });

        expect(screen.getByText(/anmelde prozess/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(forceLogin(mockedUserId));
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

    });
});
