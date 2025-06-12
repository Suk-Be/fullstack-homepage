import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorMessages from '../../../data/ErrorMessages';
import apiBaseUrl from '../../../utils/apiBaseUrl';
import * as registerModule from '../../../utils/registerUser';
import { registeredUserData } from '../../mocks/data';
import userFactory from '../../mocks/factories/userFactories';
import { navigateTo } from '../../utils';

describe('SignUp', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        vi.stubGlobal('location', { href: '' });
    });

    afterAll(() => {
        vi.stubGlobal('location', originalLocation);
    });

    const renderStatic = () => {
        navigateTo('/'); // Render HomePage
        const title = screen.getByRole('heading', { name: /Registrierung/i });
        const registerIcon = screen.getByTestId('HowToRegIcon');
        const descriptionRegistration = screen.getByTestId('description-sign-up');
        const infoSwitchToLogin = screen.getByTestId('info-switch-to-login');
        const linkSwitchToLogin = screen.getByRole('link', { name: /log in/i });

        return {
            title,
            registerIcon,
            descriptionRegistration,
            infoSwitchToLogin,
            linkSwitchToLogin,
        };
    };

    const renderRegistrationForm = () => {
        const user = userEvent.setup();
        const fakeUser = userFactory();

        navigateTo('/'); // Render HomePage

        const nameInput = screen.getByLabelText(/user name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText('Passwort');
        const passwordConfirmationInput = screen.getByLabelText(/passwort bestätigung/i);
        const termsConfirmationCheckbox = screen.getByRole('checkbox', {
            name: /Nutzung von Cookies/i,
        });

        const registerButton = screen.getByTestId('form-button-register');
        const googleButton = screen.getByTestId('form-button-register-with-google');
        const githubButton = screen.getByTestId('form-button-register-with-github');

        return {
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
            termsConfirmationCheckbox,
            registerButton,
            user,
            fakeUser,
            googleButton,
            githubButton,
        };
    };

    it('should render a title, register icon and and a register description', () => {
        const {
            title,
            registerIcon,
            descriptionRegistration,
            infoSwitchToLogin,
            linkSwitchToLogin,
        } = renderStatic();

        expect(title).toHaveTextContent(/registrierung/i);
        expect(registerIcon).toBeInTheDocument();
        expect(descriptionRegistration).toHaveTextContent(
            /Bitte registrieren Sie sich, um sich hier hinterlegte Prototypen Projekte anschauen zu können./i,
        );
        expect(infoSwitchToLogin).toHaveTextContent(/Verfügen Sie über ein Konto/i);
        expect(linkSwitchToLogin).toBeInTheDocument();
    });

    it('should render a default registration form on load', () => {
        const {
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
            termsConfirmationCheckbox,
        } = renderRegistrationForm();

        expect(nameInput).toHaveAttribute('placeholder', 'Jon Snow');
        expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
        expect(passwordInput).toHaveAttribute('placeholder', '••••••');
        expect(passwordConfirmationInput).toHaveAttribute('placeholder', '••••••');
        expect(termsConfirmationCheckbox).not.toBeChecked();
    });

    it('should render error messages on submit, if required inputs are missing', async () => {
        const {
            registerButton,
            user,
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
            termsConfirmationCheckbox,
            fakeUser,
        } = renderRegistrationForm();

        await user.click(registerButton);

        const errorUserInput = screen.getByText(ErrorMessages.SignUp.name);
        const errorEmailInput = screen.getByText(ErrorMessages.SignUp.email);
        const errorPasswordInput = screen.getByText(ErrorMessages.SignUp.password);
        const errorPasswordConfirmationInput = screen.getByText(
            ErrorMessages.SignUp.password_confirmation,
        );
        const errorTermsConfirmationCheckbox = screen.getByText(ErrorMessages.SignUp.terms);

        expect(errorUserInput).toBeInTheDocument();
        expect(errorEmailInput).toBeInTheDocument();
        expect(errorPasswordInput).toBeInTheDocument();
        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type user name
        await user.type(nameInput, fakeUser.name);
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();

        expect(errorEmailInput).toBeInTheDocument();
        expect(errorPasswordInput).toBeInTheDocument();
        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type wrong email address
        await user.type(emailInput, fakeUser.name);
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();

        expect(errorEmailInput).toBeInTheDocument();
        expect(errorPasswordInput).toBeInTheDocument();
        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type right email address
        await user.clear(emailInput);
        await user.type(emailInput, fakeUser.email);
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();
        expect(errorEmailInput).not.toBeInTheDocument();

        expect(errorPasswordInput).toBeInTheDocument();
        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type wrong password length
        await user.type(passwordInput, '1234567');
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();
        expect(errorEmailInput).not.toBeInTheDocument();

        expect((passwordInput as HTMLInputElement).value.length).toBeLessThan(8);
        expect(errorPasswordInput).toBeInTheDocument();
        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type right password length
        await user.clear(passwordInput);
        await user.type(passwordInput, fakeUser.password);
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();

        // expect(errorEmailInput).not.toBeInTheDocument();
        expect((passwordInput as HTMLInputElement).value.length).not.toBeLessThan(8);
        expect(errorPasswordInput).not.toBeInTheDocument();

        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type password confirmation, but with wrong match
        await user.type(passwordConfirmationInput, 'notSame');
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();
        expect(errorEmailInput).not.toBeInTheDocument();
        expect((passwordInput as HTMLInputElement).value.length).not.toBeLessThan(8);
        expect(errorPasswordInput).not.toBeInTheDocument();

        expect(errorPasswordConfirmationInput).toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        // type right password confirmation, password is set 12345678
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, fakeUser.password);
        await user.click(registerButton);

        expect(errorUserInput).not.toBeInTheDocument();
        expect(errorEmailInput).not.toBeInTheDocument();
        expect((passwordInput as HTMLInputElement).value.length).not.toBeLessThan(8);
        expect(errorPasswordInput).not.toBeInTheDocument();

        expect(errorPasswordConfirmationInput).not.toBeInTheDocument();
        expect(errorTermsConfirmationCheckbox).toBeInTheDocument();

        //confirm terms
        await user.click(termsConfirmationCheckbox);
        await user.click(registerButton);

        expect(errorTermsConfirmationCheckbox).not.toBeInTheDocument();

        expect(errorUserInput).not.toBeInTheDocument();
        expect(errorEmailInput).not.toBeInTheDocument();
        expect(errorPasswordInput).not.toBeInTheDocument();
        expect(errorPasswordConfirmationInput).not.toBeInTheDocument();
    });

    it('should render a hint if the user already exists', async () => {
        const {
            registerButton,
            user,
            nameInput,
            emailInput,
            passwordInput,
            passwordConfirmationInput,
            termsConfirmationCheckbox,
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

        await user.click(termsConfirmationCheckbox);
        await user.click(registerButton);

        await waitFor(() => {
            expect(screen.getByTestId('email-exists-error')).toBeInTheDocument();
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
            termsConfirmationCheckbox,
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

        await user.click(termsConfirmationCheckbox);
        await user.click(registerButton);

        await waitFor(() => {
            // Ensure the API was called
            expect(mockRegister).toHaveBeenCalledWith({
                islog: false,
                name: 'New User',
                email: 'new@user.com',
                password: 'ValidPassword123',
                password_confirmation: 'ValidPassword123',
            });
        });

        // check that inputs were reset
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(passwordInput).toHaveValue('');
        expect(passwordConfirmationInput).toHaveValue('');
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
