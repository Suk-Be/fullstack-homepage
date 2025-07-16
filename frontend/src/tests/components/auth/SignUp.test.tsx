import SignUp from '@/components/auth/SignUp';
import * as requestRegisterModule from '@/components/auth/SignUp/requestRegister';
import { login } from '@/store/loginSlice';
import { db } from '@/tests/mocks/db';
import userFactory from '@/tests/mocks/factories/userFactories';
import {
    expectErrorMessages,
    expectNoErrorMessages,
    switchToComponentHelper,
} from '@/tests/utils/testAssertUtils';
import { authProviderUrls, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

const registeredUserData = {
    id: '1',
    name: 'John Doe',
    email: 'existing@example.com',
    password: 'password123',
};

describe('SignUp - Static Content', () => {
    beforeEach(() => {
        db.user.create(registeredUserData);

        const toggleAuth = vi.fn(() => true);
        renderWithProviders(<SignUp onToggleAuth={toggleAuth} />);
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
});

describe('SignUp - Form', () => {
    beforeEach(() => {
        db.user.create(registeredUserData);

        const toggleAuth = vi.fn(() => true);
        renderWithProviders(<SignUp onToggleAuth={toggleAuth} />);
    });

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
        };
    };

    it('should render a default registration form on load', () => {
        const { nameInput, emailInput, passwordInput, passwordConfirmationInput } =
            renderRegistrationForm();

        expect(nameInput).toHaveAttribute('placeholder', 'Max Mustermann');
        expect(emailInput).toHaveAttribute('placeholder', 'max@mustermann.com');
        expect(passwordInput).toHaveAttribute('placeholder', '••••••');
        expect(passwordConfirmationInput).toHaveAttribute('placeholder', '••••••');
    });

    it('should render and clear validation errors progressively', async () => {
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
            expectErrorMessages('SignUp', ['name', 'email', 'password', 'password_confirmation']);
        });

        // 2. Fill name, submit again
        await user.type(nameInput, fakeUser.name);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages('SignUp', ['name']);
            expectErrorMessages('SignUp', ['email', 'password', 'password_confirmation']);
        });

        // 3. Enter invalid email
        await user.type(emailInput, fakeUser.name); // invalid format
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages('SignUp', ['name']);
            expectErrorMessages('SignUp', ['email', 'password', 'password_confirmation']);
        });

        // 4. Correct email
        await user.clear(emailInput);
        await user.type(emailInput, fakeUser.email);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages('SignUp', ['name', 'email']);
            expectErrorMessages('SignUp', ['password', 'password_confirmation']);
        });

        // 5. Password too short
        await user.clear(passwordInput);
        await user.type(passwordInput, '123456');
        await user.click(registerButton);
        await waitFor(() => {
            expect((passwordInput as HTMLInputElement).value.length).toBeLessThan(8);
            expectErrorMessages('SignUp', ['password', 'password_confirmation']);
        });

        // 6. Valid password
        await user.clear(passwordInput);
        await user.type(passwordInput, fakeUser.password);
        await user.click(registerButton);
        await waitFor(() => {
            expect((passwordInput as HTMLInputElement).value.length).not.toBeLessThan(8);
            expectNoErrorMessages('SignUp', ['password']);
            expectErrorMessages('SignUp', ['password_confirmation']);
        });

        // 7. Mismatched password confirmation
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, 'notSame');
        await user.click(registerButton);
        await waitFor(() => {
            expectErrorMessages('SignUp', ['password_confirmation']);
        });

        // 8. Matching password confirmation
        await user.clear(passwordInput);
        await user.type(passwordInput, fakeUser.password);
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, fakeUser.password);
        await user.click(registerButton);
        await waitFor(() => {
            expectNoErrorMessages('SignUp', ['name', 'email', 'password', 'password_confirmation']);
        });
    }, 30000);

    it('should render a hint if the user already exists', async () => {
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText(/Max Mustermann/i);
        const emailInput = screen.getByPlaceholderText(/max@mustermann.com/i);
        const [passwordInput, passwordConfirmationInput] = screen.getAllByPlaceholderText('••••••');
        const registerButton = screen.getByTestId('form-button-register');

        await user.clear(nameInput);
        await user.type(nameInput, registeredUserData.name);
        await user.clear(emailInput);
        await user.type(emailInput, registeredUserData.email);
        await user.clear(passwordInput);
        await user.type(passwordInput, registeredUserData.password);
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, registeredUserData.password);
        await user.click(registerButton);

        await waitFor(async () => {
            const error = await screen.findByText(
                /Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere./i,
            );
            expect(error).toBeInTheDocument();
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

        const mockRegisterRequest = vi
            .spyOn(requestRegisterModule, 'default')
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
            expect(mockRegisterRequest).toHaveBeenCalledWith({
                shouldFetchUser: false,
                form: {
                    name: 'New User',
                    email: 'new@user.com',
                    password: 'ValidPassword123',
                    password_confirmation: 'ValidPassword123',
                },
            });
            // check that inputs were reset
            expect(nameInput).toHaveValue('');
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
            expect(passwordConfirmationInput).toHaveValue('');

            expect(mockDispatch).toHaveBeenCalledWith(login());
        });
    });
});

describe('SignUp - AuthProviders and Toggle SignUp/In', () => {
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

    beforeEach(() => {
        db.user.create(registeredUserData);

        const toggleAuth = vi.fn(() => true);
        renderWithProviders(<SignUp onToggleAuth={toggleAuth} />);
    });

    const renderButtons = () => {
        const user = userEvent.setup();

        return {
            user,
            queryAnmeldenHeadline: screen.queryByRole('heading', { name: 'Anmelden' }),
            getRegisterHeadline: screen.getByRole('heading', { name: 'Registrieren' }),
            linkSwitchToLogin: screen.getByRole('link', { name: /anmelden/i }),
        };
    };

    it.each(authProviderUrls)(
        'redirects to $provider auth URL when clicked',
        async ({ uri, provider }) => {
            const { user } = renderButtons();

            const googleButton = screen.getByTestId('form-button-register-with-google');
            const githubButton = screen.getByTestId('form-button-register-with-github');

            if (provider === 'Google') {
                await user.click(googleButton);
                expect(window.location.href).toBe(uri);
            } else if (provider === 'Github') {
                await user.click(githubButton);
                expect(window.location.href).toBe(uri);
            }
        },
    );

    it('renders SignIn component on click of the "Anmelden" link', async () => {
        await switchToComponentHelper({ linkName: /anmelden/i });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /anmelden/i })).toBeInTheDocument();
        });
    });
});
