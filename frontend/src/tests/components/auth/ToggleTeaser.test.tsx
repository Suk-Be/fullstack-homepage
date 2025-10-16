import ToggleTeaser from '@/components/auth';
import { mockLoggedInAdminState } from '@/tests/mocks/redux';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { vi } from 'vitest';

vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));
vi.mock('@/store/thunks/loginThunk', () => ({
    loginThunk: Object.assign(
        vi.fn(async () => ({
            type: 'login/loginThunk/fulfilled',
            payload: {
                success: true,
                userId: 1,
                role: 'user',
                message: 'Login erfolgreich!',
            },
        })),
        {
            pending: { type: 'login/loginThunk/pending' },
            fulfilled: { type: 'login/loginThunk/fulfilled' },
            rejected: { type: 'login/loginThunk/rejected' },
        },
    ),
}));

vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('ToggleTeaser', () => {
    it('renders SignIn if not logged in', () => {
        renderWithProviders(<ToggleTeaser />);
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });

    it('renders to Accordion if logged in', async () => {
        renderWithProviders(<ToggleTeaser />, { preloadedState: mockLoggedInAdminState });

        expect(screen.getByText('Template Engine')).toBeInTheDocument();
    });
});
