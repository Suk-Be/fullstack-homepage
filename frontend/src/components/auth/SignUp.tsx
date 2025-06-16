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
import ErrorMessages from '../../data/ErrorMessages';
import useSignUpValidateInputs from '../../hooks/useSignUpValidation';
import setResponseErrorMessage from '../../utils/auth/setResponseErrorMessage';
import registerUser from '../../utils/auth/SignUp/registerUser';
import { handleSignInUp as handleSignUp } from '../../utils/clickHandler';
import { testId } from '../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../ContainerElements';
import { GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import { ParagraphHP } from '../TextElements';
import AuthHeaderLayout from './components/AuthHeaderLayout';
import RegisterButtonSocialite from './components/RegisterButtonSocialite';

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    // Inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    // input validation
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');

    // api response errors
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    // disable submit button
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Passwort anzeigen
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        // reset backend validation
        setErrors({});

        // FrontendValidation
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
        } = useSignUpValidateInputs(name, email, password, passwordConfirmation);

        setEmailError(emailError);
        setEmailErrorMessage(emailErrorMessage);
        setPasswordError(passwordError);
        setPasswordErrorMessage(passwordErrorMessage);
        setNameError(nameError);
        setNameErrorMessage(nameErrorMessage);
        setPasswordConfirmationError(passwordConfirmationError);
        setPasswordConfirmationErrorMessage(passwordConfirmationErrorMessage);

        // do not submit if validation fails
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        // shouldFetchUser : true logs the registered user data right after registration
        const result = await registerUser({
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
        } else {
            // response validation
            const fieldErrors = !result.success && 'errors' in result ? result.errors : {};
            setErrors(fieldErrors);
            setEmailErrorMessage(
                setResponseErrorMessage(fieldErrors, 'email', ErrorMessages.SignUp.responseEmail),
            );
        }

        setIsSubmitting(false);
    };

    // input onChange
    const clearNameErrorHandler = () => {
        setNameError(false);
        setNameErrorMessage('');
        setErrors((prev) => {
            const { name, ...rest } = prev;
            return rest;
        });
    };

    const clearEmailErrorHandler = () => {
        setEmailError(false);
        setEmailErrorMessage('');
        setErrors((prev) => {
            const { email, ...rest } = prev;
            return rest;
        });
    };

    const clearPasswordErrorHandler = () => {
        setPasswordError(false);
        setPasswordErrorMessage('');
        setErrors((prev) => {
            const { password, ...rest } = prev;
            return rest;
        });
    };

    const clearPasswordConfirmationErrorHandler = () => {
        setPasswordConfirmationError(false);
        setPasswordConfirmationErrorMessage('');
        setErrors((prev) => {
            const { passwordConfirmation, ...rest } = prev;
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
                                placeholder="Jon Snow"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    clearNameErrorHandler();
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError || !!errors.email}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearEmailErrorHandler();
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Passwort</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
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
                                    clearPasswordErrorHandler();
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
                                error={passwordConfirmationError}
                                helperText={passwordConfirmationErrorMessage}
                                color={passwordConfirmationError ? 'error' : 'primary'}
                                value={passwordConfirmation}
                                onChange={(e) => {
                                    setPasswordConfirmation(e.target.value);
                                    clearPasswordConfirmationErrorHandler();
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
