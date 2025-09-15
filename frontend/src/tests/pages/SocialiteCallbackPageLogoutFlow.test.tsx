import SocialiteCallbackPage from '@/pages/SocialiteCallbackPage';
import { logout } from '@/store/loginSlice';
import { resetUserGrids } from '@/store/userSaveGridsSlice';
import { renderWithProvidersDOM } from '@/tests/utils/testRenderUtils';
import { waitFor } from '@testing-library/dom';
import { describe, vi } from 'vitest';

const mockGet = vi.hoisted(() => vi.fn());

vi.mock('@/plugins/axios', () => ({
    __esModule: true,
    default: {
        get: mockGet,
    },
}));

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

    it('should call logout flow on failure', async () => {
        mockGet
            .mockResolvedValueOnce({}) // /csrf-cookie
            .mockRejectedValueOnce(new Error('Unauthorized')); // /me fails

        renderWithProvidersDOM(<SocialiteCallbackPage />, {
            route: '/auth/callback',
            preloadedState: {
                login: { isLoggedIn: false, userId: 42, isLoading: false, error: null }
            },
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(resetUserGrids(42));
            expect(mockDispatch).toHaveBeenCalledWith(logout());
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('should only logout when no userId is set', async () => {
      renderWithProvidersDOM(<SocialiteCallbackPage />, {
        preloadedState: { login: { isLoggedIn: false, userId: undefined } },
      });

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalledWith(resetUserGrids(expect.anything()));
        expect(mockDispatch).toHaveBeenCalledWith(logout());
      });
    });
});
