import ToggleTeaser from '@/components/auth';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';

describe('ToggleTeaser', () => {
    it('renders SignIn if not logged in', () => {
        renderWithProviders(<ToggleTeaser />);
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });

    it('renders to Accordion if logged in', async () => {
        const loggedInState = { login: { isLoggedIn: true } };
        renderWithProviders(<ToggleTeaser />, { preloadedState: loggedInState });

        expect(screen.getByText('Template Engine')).toBeInTheDocument();
    });
});
