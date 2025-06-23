import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SignIn from '../../../components/auth/SignIn';
import * as setLoginModule from '../../../components/auth/SignIn/requestLogin';
import { registeredUserData } from '../../mocks/data';
import {
    expectErrorMessages,
    expectNoErrorMessages,
    switchToComponentHelper,
} from '../../utils/testHelperFunctions';
import { authProviderUrls, renderWithProviders } from '../../utils/testRenderUtils';

describe('SignIn component', () => {
    const renderUtils = () => {
        const user = userEvent.setup();
        const toggleAuth = vi.fn(() => true);
        renderWithProviders(<SignIn onToggleAuth={toggleAuth} />);

        const emailInput = screen.getByLabelText(/email/i);

        const passwordInput = screen.getByLabelText(/passwort/i);
        const signupButton = screen.getByTestId('button-switch-to-sign-up');
        const submitButton = screen.getByTestId('form-button-login');
        const googleButton = screen.getByTestId('form-button-login-with-google');
        const githubButton = screen.getByTestId('form-button-login-with-github');
        return {
            user,
            emailInput,
            passwordInput,
            signupButton,
            submitButton,
            googleButton,
            githubButton,
        };
    };

    it('should render a default login form on load', () => {
        const { emailInput, passwordInput } = renderUtils();

        expect(emailInput).toHaveAttribute('placeholder', 'ihreEmail@mustermann.com');
        expect(passwordInput).toHaveAttribute('placeholder', '••••••');
    });

    it('should log in successfully with valid credentials', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        const mockLogin = vi
            .spyOn(setLoginModule, 'default')
            .mockResolvedValueOnce({ success: true } as any);

        await userEvent.type(emailInput, registeredUserData.email);
        await userEvent.type(passwordInput, registeredUserData.password);
        await userEvent.click(submitButton);

        await waitFor(() => {
            // Ensure the API was called
            expect(mockLogin).toHaveBeenCalledWith({
                shouldFetchUser: false,
                email: registeredUserData.email,
                password: registeredUserData.password,
            });
            // no validation errors
            expectNoErrorMessages('SignIn', ['email', 'password', 'responseEmail']);
            // check that inputs were reset
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });
    });

    it('shows field error if login fails with 422', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        await userEvent.type(emailInput, 'wrong@example.com');
        await userEvent.type(passwordInput, 'wrongpassword');
        await userEvent.click(submitButton);

        await waitFor(() => {
            // screen.debug(screen.getByTestId('form'));
            const errorMessages = screen.getAllByText('Ein unerwarteter Fehler ist aufgetreten.');
            expect(errorMessages[0]).toBeInTheDocument();
            expect(errorMessages[1]).toBeInTheDocument();
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('shows validation error on empty inputs (frontend)', async () => {
        const { submitButton } = renderUtils();

        await userEvent.click(submitButton);

        await waitFor(() => {
            expectErrorMessages('SignIn', ['email', 'password']);
        });
    });

    it('switches to register component when "Registrieren" button is clicked', async () => {
        await switchToComponentHelper({ linkName: /registrieren/i });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /registrieren/i })).toBeInTheDocument();
        });
    });

    it.each(authProviderUrls)(
        'redirects to $provider auth URL when clicked',
        async ({ uri, provider }) => {
            const { user, googleButton, githubButton } = renderUtils();

            if (provider === 'Google') {
                await user.click(googleButton);
                expect(window.location.href).toBe(uri);
            } else if (provider === 'Github') {
                await user.click(githubButton);
                expect(window.location.href).toBe(uri);
            }
        },
    );

    it('opens a "ForgotPassword" modal on click', async () => {
        const { user } = renderUtils();

        const forgotPasswordButton = screen.getByTestId('mui-link');

        await user.click(forgotPasswordButton);

        const headline = screen.getByRole('heading', { name: 'Passwort zurücksetzen' });
        expect(headline).toBeInTheDocument();
    });

    it('closes "ForgotPassword" modal on click "abbrechen"', async () => {
        const { user } = renderUtils();

        const forgotPasswordButton = screen.getByTestId('mui-link');

        await user.click(forgotPasswordButton);

        const headline = screen.getByRole('heading', { name: 'Passwort zurücksetzen' });
        expect(headline).toBeInTheDocument();
        const closingButton = screen.getByRole('button', { name: 'Abbrechen' });
        expect(closingButton).toBeInTheDocument();

        await user.click(closingButton);

        await waitFor(() => {
            const headline2 = screen.queryByRole('heading', { name: 'Passwort zurücksetzen' });
            expect(headline2).not.toBeInTheDocument();
        });
    });
});
