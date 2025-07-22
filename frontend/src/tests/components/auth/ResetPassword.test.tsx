import ResetPassword from '@/components/auth/ResetPassword';
import * as resetPassword from '@/components/auth/api/requestResetPassword';
import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import { login } from '@/store/loginSlice';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import { renderWithProvidersReactRouterDOM } from '@/tests/utils/testRenderUtils';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

describe('ForgotPassword', () => {
    beforeEach(() => {
        db.user.create({
            id: registeredUserData.id,
            name: registeredUserData.name,
            email: registeredUserData.email,
        });
    });

    const testToken = 'test-token';

    const renderUtils = () => {
        const user = userEvent.setup();

        renderWithProvidersReactRouterDOM(<ResetPassword />, {
            route: `/reset-password?token=${testToken}&email=${registeredUserData.email}`,
        });

        const submitButton = screen.getByRole('button', { name: /passwort zurücksetzen/i });

        return {
            user,
            submitButton,
        };
    };

    it('validates password and password confirmation', async () => {
        const { user, submitButton } = renderUtils();
        const spy = vi.spyOn(resetPassword, 'default');
        const passwordInput = screen.getByLabelText(/neues/i);
        const confirmPasswordInput = screen.getByLabelText(/bestätigen/i);

        await user.click(submitButton);

        const newPasswordFieldError = screen.getByText(ErrorMessages.ResetPassword.password);
        const confirmNewPasswordFieldError = screen.getByText(
            ErrorMessages.ResetPassword.password_confirmation,
        );

        expect(newPasswordFieldError).toBeInTheDocument();
        expect(confirmNewPasswordFieldError).toBeInTheDocument();

        const password = 'test123456';
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
            expect(
                screen.getByText(SuccessMessages.ResetPassword.requestSuccess),
            ).toBeInTheDocument();
        });
    });

    it('dispatches login when result.success is true', async () => {
        const { user, submitButton } = renderUtils();

        const spy = vi.spyOn(resetPassword, 'default');
        const passwordInput = screen.getByLabelText(/neues/i);
        const confirmPasswordInput = screen.getByLabelText(/bestätigen/i);

        const password = 'test123456';
        await user.type(passwordInput, password);
        await user.type(confirmPasswordInput, password);

        await user.click(submitButton);

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(
                registeredUserData.email,
                password,
                password,
                testToken,
            );
            expect(
                screen.getByText(SuccessMessages.ResetPassword.requestSuccess),
            ).toBeInTheDocument();

            expect(mockDispatch).toHaveBeenCalledWith(login());
        });
    });

    it('shows error if token is missing in URL', () => {
      renderWithProvidersReactRouterDOM(<ResetPassword />, {
        route: `/reset-password?email=${registeredUserData.email}`, // no token here
      });

      expect(screen.getByText(ErrorMessages.ResetPassword.urlToken)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /zurück zum login/i })).toBeInTheDocument();
    });

});
