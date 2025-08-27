import { Card, SignInContainer } from '@/components/ContainerElements';
import AuthHeaderLayout from '@/components/auth/shared-components/AuthHeaderLayout';
import RegisterButtonSocialite from '@/components/auth/shared-components/RegisterButtonSocialite';
import { GithubIcon, GoogleIcon } from '@/components/shared-components/CustomIcons';
import useModalToggle from '@/hooks/useModalToggle';
import useToggle from '@/hooks/useToggle';
import { useAppDispatch } from '@/store/hooks';
import { loginThunk } from '@/store/loginSlice';
import setResponseErrorMessage from '@/utils/auth/setResponseErrorMessage';
import { handleSignInUp as handleSignIn } from '@/utils/clickHandler';
import { testId } from '@/utils/testId';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import Link from '@mui/material/Link';
import { FormEvent, useState } from 'react';
import ForgotPassword from './ForgotPassword';
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
    // input field states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // validation states
    const [fieldErrors, setFieldErrors] = useState<ErrorState>({
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
    });

    // toggle buttons
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { open, handleClose, handleClickOpen } = useModalToggle();
    const [showPassword, togglePasswordVisibility] = useToggle(false);

    const dispatch = useAppDispatch();

    // execute validation, request, fields clearing and dispatches
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        setFieldErrors({
            email: { hasError: false, message: '' },
            password: { hasError: false, message: '' },
        });

        const { isValid, emailError, emailErrorMessage, passwordError, passwordErrorMessage } =
            validateSignInInputs({ email, password });

        setFieldErrors({
            email: { hasError: emailError, message: emailErrorMessage },
            password: { hasError: passwordError, message: passwordErrorMessage },
        });

        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        // 🔄 Dynamischer Import von loginThunk
        const actionResult = await dispatch(loginThunk({ email, password }));

        // console.log('actionResult.payload: ', actionResult.payload);

        if (loginThunk.fulfilled.match(actionResult)) {
            setEmail('');
            setPassword('');
            setFieldErrors({
                email: { hasError: false, message: '' },
                password: { hasError: false, message: '' },
            });

            // if (loginThunk.fulfilled.match(actionResult) && actionResult.payload?.userId) {
            //     const userId = actionResult.payload.userId;
            //     dispatch(setUserIdForGrids(userId));
            // }
            
        } else if (loginThunk.rejected.match(actionResult)) {
            const payload = actionResult.payload;

            // console.log('payload:', payload);

            const backendFieldErrors = payload?.fieldErrors || {};

            const emailResponseError = setResponseErrorMessage(
                backendFieldErrors,
                'email',
                payload?.message,
            );

            const passwordResponseError = setResponseErrorMessage(
                backendFieldErrors,
                'password',
                payload?.message,
            );

            setFieldErrors({
                email: {
                    hasError: !!emailResponseError,
                    message: emailResponseError,
                },
                password: {
                    hasError: !!passwordResponseError,
                    message: passwordResponseError,
                },
            });
        }

        setIsSubmitting(false);
    };

    // Clears the error state and rendered error for the given form field.
    // @example clearFieldError('email');
    const clearFieldError = (field: keyof ErrorState) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
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
                        <FormControl sx={{ paddingBottom: '1rem' }}>
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
                                                    onClick={togglePasswordVisibility}
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
