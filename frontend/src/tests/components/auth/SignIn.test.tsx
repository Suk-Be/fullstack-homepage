import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import SignIn from '../../../components/auth/SignIn';
import apiBaseUrl from '../../../utils/apiBaseUrl';
import * as setLoginModule from '../../../utils/auth/SignIn/setLogin';
import { registeredUserData } from '../../mocks/data';
import { server } from '../../mocks/server';
import {
    authProviderUrls,
    expectErrorMessages,
    expectNoErrorMessages,
    navigateTo,
    renderWithProviders,
} from '../../utils';

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

        server.use(
            http.post(`${apiBaseUrl}/auth/spa/login`, async () => {
                return HttpResponse.json(
                    {
                        message: 'Validation failed',
                        errors: {
                            email: [
                                'Diese E-Mail ist nicht registriert oder das Passwort ist falsch.',
                            ],
                        },
                    },
                    { status: 422 },
                );
            }),
        );

        await userEvent.type(emailInput, 'wrong@example.com');
        await userEvent.type(passwordInput, 'wrongpassword');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expectErrorMessages('SignIn', ['responseEmail']);
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

    it('switches to register component when "Registrieren" buttoin is clicked', async () => {
        navigateTo('/'); // render Homepage
        const linkSwitchToRegister = screen.getByRole('link', { name: /registrieren/i });
        const user = userEvent.setup();
        await user.click(linkSwitchToRegister);

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

    it.each(authProviderUrls)(
        'fetches user on $provider AuthCallback mount and navigates',
        async ({ provider }) => {
            const { user, googleButton, githubButton } = renderUtils();

            if (provider === 'Google') {
                await user.click(googleButton);
            } else if (provider === 'Github') {
                await user.click(githubButton);
            }

            await waitFor(() =>
                expect(screen.queryByText('Logging in...')).not.toBeInTheDocument(),
            );
        },
    );
});
