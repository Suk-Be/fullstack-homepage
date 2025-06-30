import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ResetPassword from '../../../components/auth/ResetPassword';
import * as resetPassword from '../../../components/auth/ResetPassword/requestResetPassword';
import ErrorMessages from '../../../data/ErrorMessages';
import SuccessMessages from '../../../data/SuccessMessages';
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

    const testToken = 'test-token'

    const renderUtils = () => {
        const user = userEvent.setup();
        
        renderWithProviders(<ResetPassword />, {
          route: `/reset-password?token=${testToken}&email=${registeredUserData.email}`,
        });

        const submitButton = screen.getByRole('button', {name: /passwort zurücksetzen/i});

        return {
            user,
            submitButton,
        };
    };

    it('validates password and password confirmation', async () => {
        const { user, submitButton } = renderUtils();
        const spy = vi.spyOn(resetPassword, 'default')
        const passwordInput = screen.getByLabelText(/neues/i);
        const confirmPasswordInput = screen.getByLabelText(/bestätigen/i);

        await user.click(submitButton);

        const newPasswordFieldError = screen.getByText(ErrorMessages.ResetPassword.password);
        const confirmNewPasswordFieldError = screen.getByText(ErrorMessages.ResetPassword.password_confirmation);

        expect(newPasswordFieldError).toBeInTheDocument();
        expect(confirmNewPasswordFieldError).toBeInTheDocument();

        const password = 'test123456'
        await user.type(passwordInput, password);
        
        await user.click(submitButton);
        
        expect(newPasswordFieldError).not.toBeInTheDocument();
        expect(confirmNewPasswordFieldError).toBeInTheDocument();

        await user.type(confirmPasswordInput, password);

        expect(confirmNewPasswordFieldError).not.toBeInTheDocument();

        await user.click(submitButton);

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(
              registeredUserData.email,
              password,
              password,
              testToken,
            );
            expect(screen.getByText(SuccessMessages.ResetPassword.requestSuccess)).toBeInTheDocument();
        });
    });
});
