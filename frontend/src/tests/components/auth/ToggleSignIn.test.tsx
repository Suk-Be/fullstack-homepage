import ToggleSignIn from '@/components/auth/Toggles';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ToggleSignIn', () => {
    it('renders SignIn by default', () => {
        renderWithProviders(<ToggleSignIn />);
        // screen.debug()
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });

    it('toggles to SignUp when SignIn button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ToggleSignIn />);

        await user.click(screen.getByTestId('button-switch-to-sign-up'));
        expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();
    });

    it('toggles back to SignIn when SignUp button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ToggleSignIn />);

        // First toggle to SignUp
        await user.click(screen.getByTestId('button-switch-to-sign-up'));
        expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();

        // Toggle back to SignIn
        await user.click(screen.getByTestId('button-switch-to-sign-in'));
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });
});
