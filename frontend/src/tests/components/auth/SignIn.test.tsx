import SignIn from '@/components/auth/SignIn';
import ApiClient from '@/plugins/axios';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import { expectErrorMessages, switchToComponentHelper } from '@/tests/utils/testAssertUtils';
import { authProviderUrls, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import fetchAdapter from '@/tests/utilsTest/auth/fetchAdapter';
import userEvent from '@testing-library/user-event';

ApiClient.defaults.adapter = fetchAdapter;

describe('SignIn component', () => {
    beforeEach(() => {
        db.user.create(registeredUserData);

        const toggleAuth = vi.fn(() => false);
        renderWithProviders(<SignIn onToggleAuth={toggleAuth} />);
    });

    const renderUtils = () => {
        const user = userEvent.setup();
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
        const { user, emailInput, passwordInput, submitButton } = renderUtils();

        await user.type(emailInput, registeredUserData.email);
        await user.type(passwordInput, registeredUserData.password);
        await user.click(submitButton);

        console.log('Alle User in DB:', db.user.getAll());

        expect(
            db.user.findFirst({
                where: {
                    email: { equals: registeredUserData.email },
                },
            }),
        ).toBeDefined();
    });

    it('shows field error if login fails with 422', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        const notRegisteredEmail = 'wrong@example.com';

        await userEvent.type(emailInput, notRegisteredEmail);
        await userEvent.type(passwordInput, 'wrongpassword');
        await userEvent.click(submitButton);

        expect(
            db.user.findFirst({
                where: {
                    email: { equals: notRegisteredEmail },
                },
            }),
        ).toBe(null);
    });

    it('shows validation error on empty inputs (frontend)', async () => {
        const { submitButton } = renderUtils();

        await userEvent.click(submitButton);

        await waitFor(() => {
            expectErrorMessages('SignIn', ['email', 'password']);
        });
    });

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

describe('SignIn - AuthProviders and Toggle SignUp/In', () => {
    const originalLocation = window.location;

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                ...window.location,
                assign: vi.fn(),
                replace: vi.fn(),
                href: '',
            },
        });
    });

    afterAll(() => {
        window.location.href = originalLocation.href;
    });

    const renderButtons = () => {
        const toggleAuth = vi.fn(() => false);
        renderWithProviders(<SignIn onToggleAuth={toggleAuth} />);
        const user = userEvent.setup();

        return {
            user,
        };
    };

    it.each(authProviderUrls)(
        'redirects to $provider auth URL when clicked',
        async ({ uri, provider }) => {
            const { user } = renderButtons();

            const googleButton = screen.getByTestId('form-button-login-with-google');
            const githubButton = screen.getByTestId('form-button-login-with-github');

            if (provider === 'Google') {
                await user.click(googleButton);
                expect(window.location.href).toBe(uri);
            } else if (provider === 'Github') {
                await user.click(githubButton);
                expect(window.location.href).toBe(uri);
            }
        },
    );

    it('renders SignUp component on click of the "Registrieren" link', async () => {
        await switchToComponentHelper({ linkName: /registrieren/i });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /registrieren/i })).toBeInTheDocument();
        });
    });
});
