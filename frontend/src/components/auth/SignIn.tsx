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
import { validateSignInInputs } from '../../hooks/useSignInValidation';
import setLogin from '../../utils/auth/setLogin';
import setResponseErrorMessage from '../../utils/auth/setResponseErrorMessage';
import { handleSignInUp as handleSignIn } from '../../utils/clickHandler';
import { testId } from '../../utils/testId';
import { Card, SignInContainer } from '../ContainerElements';
import { GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import AuthHeaderLayout from './AuthHeaderLayout';
import ForgotPassword from './components/ForgotPassword';
import RegisterButtonSocialite from './RegisterButtonSocialite';

const SignIn = ({ onToggleAuth }: { onToggleAuth: () => void }) => {
    // inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // input validation
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    // api response errors
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        // reset backend validation
        setErrors({});

        // Frontend validation
        const { isValid, emailError, emailErrorMessage, passwordError, passwordErrorMessage } =
            validateSignInInputs(email, password);

        setEmailError(emailError);
        setEmailErrorMessage(emailErrorMessage);
        setPasswordError(passwordError);
        setPasswordErrorMessage(passwordErrorMessage);

        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        // start backend communication
        const result = await setLogin({
            shouldFetchUser: true,
            email,
            password,
        });

        if (result.success) {
            setEmail('');
            setPassword('');
            setEmailError(false);
            setPasswordError(false);
            setErrors({});
        } else {
            // response validation
            const fieldErrors = result.errors || {};
            setErrors(fieldErrors);
            setEmailErrorMessage(
                setResponseErrorMessage(
                    fieldErrors,
                    'email',
                    'Ein unbekannter Fehler bei der E-Mail.',
                ),
            );
            setPasswordError(true);
            setPasswordErrorMessage(
                setResponseErrorMessage(
                    fieldErrors,
                    'password',
                    'Das Passwort ist falsch oder diese E-Mail ist nicht registriert.',
                ),
            );
        }

        setIsSubmitting(false);
    };

    // input onChange
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
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError || !!errors.email}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearEmailErrorHandler();
                                }}
                                value={email}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Passwort</FormLabel>
                            <TextField
                                error={passwordError || !!errors.password}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearPasswordErrorHandler();
                                }}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Login für dieses Gerät merken"
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
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
            </SignInContainer>
        </>
    );
};

export default SignIn;
