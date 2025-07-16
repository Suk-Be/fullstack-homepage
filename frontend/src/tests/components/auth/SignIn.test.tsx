import SignIn from '@/components/auth/SignIn';
import ErrorMessages from '@/data/ErrorMessages';
import { login } from '@/store/loginSlice';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import {
    expectErrorMessages,
    expectNoErrorMessages,
    switchToComponentHelper,
} from '@/tests/utils/testAssertUtils';
import { authProviderUrls, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

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
        const { emailInput, passwordInput, submitButton } = renderUtils();

        await userEvent.type(emailInput, registeredUserData.email);
        await userEvent.type(passwordInput, registeredUserData.password);
        await userEvent.click(submitButton);

        await waitFor(() => {
            // screen.debug(screen.getByTestId('form'));
            expectNoErrorMessages('SignIn', ['email', 'password']);
            expect(submitButton).not.toBeDisabled();
            expect(mockDispatch).toHaveBeenCalledWith(login());
        });
    });

    it('shows field error if login fails with 422', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        await userEvent.type(emailInput, 'wrong@example.com');
        await userEvent.type(passwordInput, 'wrongpassword');
        await userEvent.click(submitButton);

        await waitFor(() => {
            // screen.debug(screen.getByTestId('form'));
            const errorMessagesForEmailAndPassword = screen.getAllByText(
                ErrorMessages.SignIn.responseEmail,
            );
            expect(errorMessagesForEmailAndPassword[0]).toBeInTheDocument();
            expect(errorMessagesForEmailAndPassword[1]).toBeInTheDocument();
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
