import ForgotPassword from '@/components/auth/SignIn/ForgotPassword';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));

describe('ForgotPassword', () => {
    beforeEach(() => {
        db.user.create({
            id: registeredUserData.id,
            name: registeredUserData.name,
            email: registeredUserData.email,
        });
    });

    const renderUtils = () => {
        const user = userEvent.setup();
        const handleClose = vi.fn();
        renderWithProviders(<ForgotPassword open={true} handleClose={handleClose} />);

        const submitButton = screen.getByTestId('submit-forgot-password');

        return {
            user,
            submitButton,
        };
    };

    it('validates an email to be in email format and existent in database', async () => {
        const { user, submitButton } = renderUtils();
        const emailInput = screen.getByRole('textbox', { name: /email/i });

        await user.click(submitButton);

        const feValidation = screen.getByText('Bitte geben Sie eine gültige Email Adresse an.');

        expect(feValidation).toBeInTheDocument();

        await user.type(emailInput, 'unknownUser@user.de');

        await user.click(submitButton);

        await waitFor(() => {
            // screen.debug();
            const errorMessage = screen.getByText(
                'Es konnte kein Benutzer mit dieser E-Mail-Adresse gefunden werden.',
            );
            expect(errorMessage).toBeInTheDocument();
            expect(submitButton).not.toBeDisabled();
        });
    });
});
