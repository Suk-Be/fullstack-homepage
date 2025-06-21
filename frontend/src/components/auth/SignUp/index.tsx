import { HowToReg as HowToRegIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { FormEvent, useCallback, useState } from 'react';
import ErrorMessages from '../../../data/ErrorMessages';
import { handleSignInUp as handleSignUp } from '../../../utils/clickHandler';
import { testId } from '../../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../../ContainerElements';
import { GithubIcon, GoogleIcon } from '../../shared-components/CustomIcons';
import { ParagraphHP } from '../../TextElements';
import AuthHeaderLayout from '../shared-components/AuthHeaderLayout';
import RegisterButtonSocialite from '../shared-components/RegisterButtonSocialite';
import requestRegister from './requestRegister';
import validateInputs from './validateSignUpInputs';

type FieldError = {
    hasError: boolean;
    message: string;
};

type ErrorState = {
    name: FieldError;
    email: FieldError;
    password: FieldError;
    passwordConfirmation: FieldError;
};

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    // Inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    /**
     * Tracks the client-side (frontend) validation errors for each form field.
     *
     * Each field in `fieldErrors` contains:
     * - `hasError`: A boolean indicating if a validation error is present.
     * - `message`: A descriptive error message to show to the user.
     *
     * Used for immediate feedback before any API call is made.
     */
    const [fieldErrors, setFieldErrors] = useState<ErrorState>({
        name: { hasError: false, message: '' },
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
        passwordConfirmation: { hasError: false, message: '' },
    });

    /**
     * Stores server-side (backend) validation errors returned from the API.
     *
     * The object maps field names to arrays of error messages received from the backend.
     * This is useful for displaying detailed validation errors from the server response.
     *
     * Example:
     * {
     *   email: ["This email is already taken."],
     *   password: ["Password must be at least 8 characters."]
     * }
     */
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    // disable submit button
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Passwort anzeigen
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    // execute validations, submit and clearing fields
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        // reset backend validation
        setErrors({});

        // FrontendValidation
        // FYI: to execute own form validation instead of the browser validation
        const {
            isValid,
            emailError,
            emailErrorMessage,
            passwordError,
            passwordErrorMessage,
            passwordConfirmationError,
            passwordConfirmationErrorMessage,
            nameError,
            nameErrorMessage,
        } = validateInputs(name, email, password, passwordConfirmation);

        setFieldErrors({
            name: { hasError: nameError, message: nameErrorMessage },
            email: { hasError: emailError, message: emailErrorMessage },
            password: { hasError: passwordError, message: passwordErrorMessage },
            passwordConfirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        // do not submit if validation fails
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        // shouldFetchUser : true logs the registered user data right after registration
        const result = await requestRegister({
            shouldFetchUser: false,
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });

        if (result.success) {
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
            setFieldErrors({
                name: { hasError: false, message: '' },
                email: { hasError: false, message: '' },
                password: { hasError: false, message: '' },
                passwordConfirmation: { hasError: false, message: '' },
            });
        } else if ('errors' in result) {
            const emailErrors = result.message;
            if (emailErrors?.length) {
                setFieldErrors((prev) => ({
                    ...prev,
                    email: {
                        hasError: true,
                        message: emailErrors || ErrorMessages.SignUp.responseEmail,
                    },
                }));
            }
        }

        setIsSubmitting(false);
    };

    /**
     * Clears the error state for a specific form field.
     *
     * This function resets both the frontend validation error (`fieldErrors`)
     * and backend error messages (`errors`) associated with the specified field.
     *
     * @param {keyof ErrorState} field - The name of the field whose error state should be cleared.
     *
     * @example
     * clearFieldError('email');
     */
    const clearFieldError = (field: keyof ErrorState) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
        setErrors((prev) => {
            const { [field]: _ignored, ...rest } = prev;
            return rest;
        });
    };

    return (
        <>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <HowToRegIcon sx={{ color: (theme) => theme.palette.primary.main }} />
                    <AuthHeaderLayout
                        title="Registrieren"
                        onToggleAuth={onToggleAuth}
                        textBeforeLink="Verfügen Sie über ein Konto?"
                        linkLabel="Anmelden"
                        testIds={{
                            title: 'title-sign-up',
                            link: 'button-switch-to-sign-in',
                        }}
                    />

                    <ParagraphHP marginTop="1rem" {...testId('description-sign-up')}>
                        Bitte registrieren Sie sich, um sich hier hinterlegte Prototypen Projekte
                        anschauen zu können. Bei Bedarf können Sie das angelegte Konto im Nutzer
                        Menü löschen oder verwalten.
                    </ParagraphHP>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        {...testId('form')}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Benutzername</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Max Mustermann"
                                error={fieldErrors.name.hasError}
                                helperText={fieldErrors.name.message}
                                color={fieldErrors.name.hasError ? 'error' : 'primary'}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    clearFieldError('name');
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="max@mustermann.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={fieldErrors.email.hasError || !!errors.email}
                                helperText={fieldErrors.email.message}
                                color={fieldErrors.email.hasError ? 'error' : 'primary'}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearFieldError('email');
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Passwort</FormLabel>
                            <TextField
                                error={fieldErrors.password.hasError}
                                helperText={fieldErrors.password.message}
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={fieldErrors.password.hasError ? 'error' : 'primary'}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                    aria-label="Toggle password visibility"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearFieldError('password');
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="passwordConfirmation">
                                Passwort Bestätigung
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="passwordConfirmation"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="passwordConfirmation"
                                autoComplete="new-password"
                                variant="outlined"
                                error={fieldErrors.passwordConfirmation.hasError}
                                helperText={fieldErrors.passwordConfirmation.message}
                                color={
                                    fieldErrors.passwordConfirmation.hasError ? 'error' : 'primary'
                                }
                                value={passwordConfirmation}
                                onChange={(e) => {
                                    setPasswordConfirmation(e.target.value);
                                    clearFieldError('passwordConfirmation');
                                }}
                                {...testId('form-input-password-confirmation')}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            {...testId('form-button-register')}
                        >
                            {isSubmitting ? 'Wird gesendet...' : 'Registrieren'}
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <RegisterButtonSocialite
                            startIcon={<GithubIcon />}
                            text="registrieren mit Github"
                            testIdIdentifier="form-button-register-with-github"
                            clickHandler={() => handleSignUp('github')}
                        />
                        <RegisterButtonSocialite
                            startIcon={<GoogleIcon />}
                            text="registrieren mit Google"
                            clickHandler={() => handleSignUp('google')}
                            testIdIdentifier="form-button-register-with-google"
                        />

                        <ParagraphHP
                            marginTop="1rem"
                            marginBottom="0.5rem"
                            sx={{ textAlign: 'center' }}
                        >
                            Es werden{' '}
                            <a
                                href="/datenschutz"
                                style={{ color: '#1976d2' }}
                                target="_blank"
                                rel="noopener noreferrer"
                                {...testId('form-checkbox-datenschutz')}
                            >
                                Cookies
                            </a>{' '}
                            eingesetzt, um Ihr Nutzererlebnis zu verbessern.
                        </ParagraphHP>
                    </Box>
                </Card>
            </SignUpContainer>
        </>
    );
}
