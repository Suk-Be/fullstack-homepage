import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ForgotPassword from '../../../components/auth/SignIn/ForgotPassword';
import { registeredUserData } from '../../mocks/data';
import { db } from '../../mocks/db';
import { renderWithProviders } from '../../utils/testRenderUtils';

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

    it('validate email input on', async () => {
        const { user, submitButton } = renderUtils();
        const emailInput = screen.getByRole('textbox', { name: /email/i });

        await user.click(submitButton);

        const feValidation = screen.getByText('Bitte geben Sie eine gültige Email Adresse an.');

        expect(feValidation).toBeInTheDocument();

        await user.type(emailInput, 'unknownUser@user.de');

        await user.click(submitButton);

        await waitFor(() => {
            const errorMessages = screen.getAllByText(
                'Ein Problem ist aufgetreten. Bitte versuchen Sie es erneut.',
            );
            expect(errorMessages[0]).toBeInTheDocument();
            expect(submitButton).not.toBeDisabled();
        });
    });
});
