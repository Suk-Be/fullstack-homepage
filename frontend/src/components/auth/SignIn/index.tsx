import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { IconButton, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useCallback, useState } from 'react';
import setResponseErrorMessage from '../../../utils/auth/setResponseErrorMessage';
import { handleSignInUp as handleSignIn } from '../../../utils/clickHandler';
import { testId } from '../../../utils/testId';
import { Card, SignInContainer } from '../../ContainerElements';
import { GithubIcon, GoogleIcon } from '../../shared-components/CustomIcons';
import AuthHeaderLayout from '../shared-components/AuthHeaderLayout';
import RegisterButtonSocialite from '../shared-components/RegisterButtonSocialite';
import ForgotPassword from './ForgotPassword';
import requestLogin from './requestLogin';
import { validateSignInInputs } from './validateSignInInputs';

type FieldError = {
    hasError: boolean;
    message: string;
};

type ErrorState = {
    email: FieldError;
    password: FieldError;
};

const SignIn = ({ onToggleAuth }: { onToggleAuth: () => void }) => {
    // inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // frontend input validation errors
    const [fieldErrors, setFieldErrors] = useState<ErrorState>({
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
    });
    // e.g. api response validation errors
    /**
     * {
     *   email: ["This email is already taken."],
     *   password: ["Password must be at least 8 characters."]
     * }
     */
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    // disable submit button
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Passwort vergessen
    const [open, setOpen] = useState(false);
    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);
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

        // Frontend validation
        const { isValid, emailError, emailErrorMessage, passwordError, passwordErrorMessage } =
            validateSignInInputs(email, password);

        setFieldErrors({
            email: { hasError: emailError, message: emailErrorMessage },
            password: { hasError: passwordError, message: passwordErrorMessage },
        });

        // do not submit if frontend validation fails
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        // submit
        const result = await requestLogin({
            shouldFetchUser: false,
            email,
            password,
        });

        // frontend validation on backend's validation response
        if (result.success) {
            setEmail('');
            setPassword('');
            setFieldErrors({
                email: { hasError: false, message: '' },
                password: { hasError: false, message: '' },
            });
            setErrors({});
        } else {
            // response validation
            const backendRawErrors = result.errors || {};
            const generalErrorMessage = result.message || 'Ein unbekannter Fehler ist aufgetreten.';

            const emailBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'email',
                generalErrorMessage,
            );

            const passwordBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'password',
                generalErrorMessage,
            );

            setFieldErrors({
                email: {
                    hasError: !!emailBackendErrorMessage, // Set hasError based on whether a message exists
                    message: emailBackendErrorMessage,
                },
                password: {
                    hasError: !!passwordBackendErrorMessage, // Set hasError based on whether a message exists
                    message: passwordBackendErrorMessage,
                },
            });
        }

        setIsSubmitting(false);
    };

    /**
     * Clears the error state and rendered error for the given form field.
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
            <SignInContainer
                direction="column"
                justifyContent="space-between"
                {...testId('sign-in-container')}
            >
                <Card variant="outlined">
                    <LockOpenIcon sx={{ color: (theme) => theme.palette.primary.main }} />
                    <AuthHeaderLayout
                        title="Anmelden"
                        onToggleAuth={onToggleAuth}
                        textBeforeLink="Haben Sie noch kein Nutzer Konto?"
                        linkLabel="Registrieren"
                        testIds={{
                            title: 'title-sign-in',
                            link: 'button-switch-to-sign-up',
                        }}
                    />
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                        {...testId('form')}
                    >
                        <FormControl {...testId('email-input-login')}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={fieldErrors.email.hasError}
                                helperText={fieldErrors.email.message}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="ihreEmail@mustermann.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={fieldErrors.email.hasError ? 'error' : 'primary'}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearFieldError('email');
                                }}
                                value={email}
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Login für dieses Gerät merken"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                '&.Mui-disabled': {
                                    color: 'common.white',
                                },
                            }}
                            {...testId('form-button-login')}
                        >
                            {isSubmitting ? 'Wird gesendet...' : 'Anmelden'}
                        </Button>

                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            {...testId('mui-link')}
                        >
                            Benötigen Sie ein neues Passwort?
                        </Link>
                    </Box>
                    <Divider>oder</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <RegisterButtonSocialite
                            startIcon={<GithubIcon />}
                            text="Anmelden mit Github"
                            testIdIdentifier="form-button-login-with-github"
                            clickHandler={() => handleSignIn('github')}
                        />
                        <RegisterButtonSocialite
                            startIcon={<GoogleIcon />}
                            text="Anmelden mit Google"
                            testIdIdentifier="form-button-login-with-google"
                            clickHandler={() => handleSignIn('google')}
                        />
                    </Box>
                </Card>
                <ForgotPassword open={open} handleClose={handleClose} />
            </SignInContainer>
        </>
    );
};

export default SignIn;
