import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import SignUp from '../../../components/auth/SignUp';
import ErrorMessages from '../../../data/ErrorMessages';
import apiBaseUrl from '../../../utils/apiBaseUrl';
import * as registerModule from '../../../utils/auth/SignUp/registerUser';
import { registeredUserData } from '../../mocks/data';
import userFactory from '../../mocks/factories/userFactories';
import { navigateTo, renderWithProviders } from '../../utils';

const renderRegistrationForm = () => {
    const user = userEvent.setup();
    const fakeUser = userFactory();

    return {
        user,
        fakeUser,
        nameInput: screen.getByLabelText(/benutzername/i),
        emailInput: screen.getByLabelText(/email/i),
        passwordInput: screen.getByLabelText('Passwort'),
        passwordConfirmationInput: screen.getByLabelText(/passwort bestätigung/i),
        registerButton: screen.getByTestId('form-button-register'),
        googleButton: screen.getByTestId('form-button-register-with-google'),
        githubButton: screen.getByTestId('form-button-register-with-github'),
    };
};

describe('SignUp', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        vi.stubGlobal('location', { href: '' });
        const toggleAuth = vi.fn(() => false);
        renderWithProviders(<SignUp onToggleAuth={toggleAuth} />);
    });

    afterAll(() => {
        vi.stubGlobal('location', originalLocation);
    });

    const renderStatic = () => {
        return {
            title: screen.getByRole('heading', { name: /registrieren/i }),
            registerIcon: screen.getByTestId('HowToRegIcon'),
            descriptionRegistration: screen.getByTestId('description-sign-up'),
            linkSwitchToLogin: screen.getByRole('link', { name: /anmelden/i }),
        };
    };

    it('should render a title, register icon and and a register description', () => {
        const { title, registerIcon, descriptionRegistration, linkSwitchToLogin } = renderStatic();

        expect(title).toHaveTextContent(/registrieren/i);
        expect(registerIcon).toBeInTheDocument();
        expect(descriptionRegistration).toHaveTextContent(
            /Bitte registrieren Sie sich, um sich hier hinterlegte Prototypen Projekte anschauen zu können./i,
        );
        expect(linkSwitchToLogin).toBeInTheDocument();
    });

    it('should render a default registration form on load', () => {
        const { nameInput, emailInput, passwordInput, passwordConfirmationInput } =
            renderRegistrationForm();

        expect(nameInput).toHaveAttribute('placeholder', 'Jon Snow');
        expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
        expect(passwordInput).toHaveAttribute('placeholder', '••••••');
        expect(passwordConfirmationInput).toHaveAttribute('placeholder', '••••••');
    });

    it('should render and clear validation errors progressively', async () => {
        // Helper: Expect error to be present
        const expectErrorMessages = (fields: Array<keyof (typeof ErrorMessages)['SignUp']>) => {
            fields.forEach((field) => {
                expect(screen.getByText(ErrorMessages.SignUp[field])).toBeInTheDocument();
            });
        };

        // Helper: Expect error to be gone
        const expectNoErrorMessages = (fields: Array<keyof (typeof ErrorMessages)['SignUp']>) => {
            fields.forEach((field) => {
                expect(screen.queryByText(ErrorMessages.SignUp[field])).not.toBeInTheDocument();
            });
        };

        const {
            user,
            fakeUser,
            registerButton,
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
        } = renderRegistrationForm();

        // 1. Submit with empty form
        await user.click(registerButton);
        await waitFor(() => {
            expectErrorMessages(['name', 'email', 'password', 'password_confirmation']);
        });

        // 2. Fill name, submit again
        await user.type(nameInput, fakeUser.name);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages(['name']);
            expectErrorMessages(['email', 'password', 'password_confirmation']);
        });

        // 3. Enter invalid email
        await user.type(emailInput, fakeUser.name); // invalid format
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages(['name']);
            expectErrorMessages(['email', 'password', 'password_confirmation']);
        });

        // 4. Correct email
        await user.clear(emailInput);
        await user.type(emailInput, fakeUser.email);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages(['name', 'email']);
            expectErrorMessages(['password', 'password_confirmation']);
        });

        // 5. Password too short
        await user.clear(passwordInput);
        await user.type(passwordInput, '123456');
        await user.click(registerButton);
        await waitFor(() => {
            expect((passwordInput as HTMLInputElement).value.length).toBeLessThan(8);
            expectErrorMessages(['password', 'password_confirmation']);
        });

        // 6. Valid password
        await user.clear(passwordInput);
        await user.type(passwordInput, fakeUser.password);
        await user.click(registerButton);
        await waitFor(() => {
            expect((passwordInput as HTMLInputElement).value.length).not.toBeLessThan(8);
            expectNoErrorMessages(['password']);
            expectErrorMessages(['password_confirmation']);
        });

        // 7. Mismatched password confirmation
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, 'notSame');
        await user.click(registerButton);
        await waitFor(() => {
            expectErrorMessages(['password_confirmation']);
        });

        // 8. Matching password confirmation
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, fakeUser.password);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages(['name', 'email', 'password', 'password_confirmation']);
        });
    }, 20000);

    it('should render a hint if the user already exists', async () => {
        const {
            registerButton,
            user,
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
        } = renderRegistrationForm();

        // First: Submit existing user
        await user.clear(nameInput);
        await user.type(nameInput, registeredUserData.name);

        await user.clear(emailInput);
        await user.type(emailInput, registeredUserData.email);

        await user.clear(passwordInput);
        await user.type(passwordInput, registeredUserData.password);

        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, registeredUserData.password);

        await user.click(registerButton);

        await waitFor(() => {
            // screen.debug(screen.getByTestId('form'));
            expect(screen.getByText(ErrorMessages.SignUp.responseEmail)).toBeInTheDocument();
        });
    });

    it('should register a new user successfully and clear the form', async () => {
        const {
            user,
            registerButton,
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
        } = renderRegistrationForm();

        const mockRegister = vi
            .spyOn(registerModule, 'default')
            .mockResolvedValueOnce({ success: true } as any);

        await user.clear(nameInput);
        await user.type(nameInput, 'New User');

        await user.clear(emailInput);
        await user.type(emailInput, 'new@user.com');

        await user.clear(passwordInput);
        await user.type(passwordInput, 'ValidPassword123');

        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, 'ValidPassword123');

        await user.click(registerButton);

        await waitFor(() => {
            // Ensure the API was called
            expect(mockRegister).toHaveBeenCalledWith({
                shouldFetchUser: false,
                name: 'New User',
                email: 'new@user.com',
                password: 'ValidPassword123',
                password_confirmation: 'ValidPassword123',
            });
            // check that inputs were reset
            expect(nameInput).toHaveValue('');
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
            expect(passwordConfirmationInput).toHaveValue('');
        });
    });

    const authProviderUtil = [
        {
            provider: 'GitHub',
            uri: `${apiBaseUrl}/auth/github`,
        },
        {
            provider: 'Google',
            uri: `${apiBaseUrl}/auth/google`,
        },
    ];

    it.each(authProviderUtil)(
        'redirects to $provider auth URL when clicked',
        async ({ uri, provider }) => {
            const { user, googleButton, githubButton } = renderRegistrationForm();

            if (provider === 'Google') {
                await user.click(googleButton);
                expect(window.location.href).toBe(uri);
            } else if (provider === 'Github') {
                await user.click(githubButton);
                expect(window.location.href).toBe(uri);
            }
        },
    );

    it.each(authProviderUtil)(
        'fetches user on $provider AuthCallback mount and navigates',
        async ({ provider }) => {
            const { user, googleButton, githubButton } = renderRegistrationForm();

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

describe('Toggle SignUp component', () => {
    it('renders SignIn component on click of the "Anmelden" link', async () => {
        navigateTo('/'); // render Homepage
        const { user } = renderRegistrationForm();
        const QueryLoginHeadline = screen.queryByRole('heading', { name: 'Anmelden' });
        const RegisterHeadline = screen.getByRole('heading', { name: 'Registrieren' });

        expect(RegisterHeadline).toBeInTheDocument();
        expect(QueryLoginHeadline).not.toBeInTheDocument();

        const linkSwitchToLogin = screen.getByRole('link', { name: /anmelden/i });
        await user.click(linkSwitchToLogin);

        await waitFor(() => {
            const LoginHeadline = screen.getByRole('heading', { name: 'Anmelden' });
            const QueryRegisterHeadline = screen.queryByRole('heading', { name: 'Registrieren' });

            expect(QueryRegisterHeadline).not.toBeInTheDocument();
            expect(LoginHeadline).toBeInTheDocument();
        });
    });
});
