import resetPassword from '@/components/auth/api/requestResetPassword';
import { Card, SectionCenteredChild, SignInContainer } from '@/components/ContainerElements';
import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import useToggle from '@/hooks/useToggle';
import type { AppDispatch } from '@/store';
import { login } from '@/store/loginSlice';
import setResponseErrorMessage from '@/utils/auth/setResponseErrorMessage'; // Ihre bestehende Funktion
import { testId } from '@/utils/testId';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'; // Angenommen, Sie verwenden React Router
import validateInputs from './validateResetPassPassword';

type FieldError = {
    hasError: boolean;
    message: string;
};

type FormErrors = {
    password: FieldError;
    password_confirmation: FieldError;
};

const ResetPassword = () => {
    // url related
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    // input field states
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    // validation states
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({
        password: { hasError: false, message: '' },
        password_confirmation: { hasError: false, message: '' },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [generalErrorMessage, setGeneralErrorMessage] = useState<string | null>(null);

    const [showPassword, handleTogglePassword] = useToggle();

    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const handleTogglePasswordConfirmation = useCallback(() => {
        setShowPasswordConfirmation((prev) => !prev);
    }, []);

    // Extrahiere Token und E-Mail aus der URL bei Komponenten-Mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get('token');
        const urlEmail = queryParams.get('email');

        if (urlToken) {
            setToken(urlToken);
        } else {
            setGeneralErrorMessage(ErrorMessages.ResetPassword.urlToken);
        }
        if (urlEmail) {
            setEmail(urlEmail);
        }
    }, [location.search]);

    const dispatch: AppDispatch = useDispatch();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // resets
        event.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({
            password: { hasError: false, message: '' },
            password_confirmation: { hasError: false, message: '' },
        });
        setSuccessMessage(null);
        setGeneralErrorMessage(null);

        const {
            isValid,
            passwordError,
            passwordErrorMessage,
            passwordConfirmationError,
            passwordConfirmationErrorMessage,
            tokenError,
            tokenErrorMessage,
        } = validateInputs({
            password,
            password_confirmation: passwordConfirmation,
            token: token ?? '',
        });

        setFieldErrors({
            password: { hasError: passwordError, message: passwordErrorMessage },
            password_confirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        // without token
        if (tokenError) {
            setGeneralErrorMessage(tokenErrorMessage);
            setIsSubmitting(false);
            return;
        }

        setFieldErrors({
            password: { hasError: passwordError, message: passwordErrorMessage },
            password_confirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        const result = await resetPassword(email, password, passwordConfirmation, token as string);

        if (result.success) {
            setSuccessMessage(result.message || SuccessMessages.ResetPassword.requestSuccess);
            dispatch(login()); // Dispatch action to set isLoggedIn state to be true
            if (import.meta.env.MODE !== 'test' || process.env.NODE_ENV !== 'test') {
                setTimeout(() => navigate('/'), 3000);
            }
        } else {
            const backendRawErrors = result.errors || {};
            const generalErrorMessage = result.message || 'Ein unbekannter Fehler ist aufgetreten.';

            const passwordBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'password',
                generalErrorMessage,
            );

            const passwordConfirmationBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'password_confirmation',
                generalErrorMessage,
            );

            setFieldErrors({
                password: {
                    hasError: !!passwordBackendErrorMessage,
                    message: passwordBackendErrorMessage,
                },
                password_confirmation: {
                    hasError: !!passwordConfirmationBackendErrorMessage,
                    message: passwordConfirmationBackendErrorMessage,
                },
            });
        }
        setIsSubmitting(false);
    };

    const clearFieldError = (field: keyof FormErrors) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
        setGeneralErrorMessage(null); // Clear general error message when typing
    };

    if (generalErrorMessage && !token) {
        // Zeigt Fehler an, wenn Token fehlt, bevor das Formular überhaupt gerendert wird
        return (
            <SignInContainer>
                <Card>
                    <Typography color="error">{generalErrorMessage}</Typography>
                    <Button onClick={() => navigate('/')}>Zurück zum Login</Button>
                </Card>
            </SignInContainer>
        );
    }

    const layoutStyle = {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            md: 'row',
        },
        justifyContent: 'center',
        alignItems: {
            xs: 'center',
            md: 'flex-start',
        },
    };

    return (
        <>
            <SectionCenteredChild>
                <Box sx={layoutStyle}>
                    <SignInContainer direction="column" justifyContent="space-between">
                        <Card
                            variant="outlined"
                            sx={{
                                minWidth: {
                                    xs: '95vw',
                                    sm: '50vw',
                                },
                            }}
                        >
                            <LockOpenIcon sx={{ color: (theme) => theme.palette.primary.main }} />
                            <Typography component="h1" variant="h5">
                                Passwort zurücksetzen
                            </Typography>
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
                                    <FormLabel htmlFor="email-reset">E-Mail-Adresse</FormLabel>
                                    <TextField
                                        id="email-reset"
                                        type="email"
                                        name="email"
                                        placeholder="Ihre@email.com"
                                        fullWidth
                                        required
                                        disabled // E-Mail-Feld sollte von der URL vorab ausgefüllt und nicht bearbeitbar sein
                                        value={email}
                                        {...testId('email-disabled')}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password-reset">Neues Passwort</FormLabel>
                                    <TextField
                                        id="password-reset"
                                        name="password"
                                        placeholder="••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        required
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearFieldError('password');
                                        }}
                                        error={fieldErrors.password.hasError}
                                        helperText={fieldErrors.password.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleTogglePassword}
                                                            edge="end"
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
                                        {...testId('password')}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password-confirmation-reset">
                                        Passwort bestätigen
                                    </FormLabel>
                                    <TextField
                                        id="password-confirmation-reset"
                                        name="password_confirmation"
                                        placeholder="••••••"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        fullWidth
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) => {
                                            setPasswordConfirmation(e.target.value);
                                            clearFieldError('password_confirmation');
                                        }}
                                        error={fieldErrors.password_confirmation.hasError}
                                        helperText={fieldErrors.password_confirmation.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={
                                                                handleTogglePasswordConfirmation
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPasswordConfirmation ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        {...testId('confirmPassword')}
                                    />
                                </FormControl>

                                {generalErrorMessage && (
                                    <Typography color="error" sx={{ mt: 2 }}>
                                        {generalErrorMessage}
                                    </Typography>
                                )}
                                {successMessage && (
                                    <Typography color="success.main" sx={{ mt: 2 }}>
                                        {successMessage}
                                    </Typography>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{ mt: 3, mb: 2 }}
                                    {...testId('submit-reset-password')}
                                >
                                    {isSubmitting
                                        ? 'Wird zurückgesetzt...'
                                        : 'Passwort zurücksetzen'}
                                </Button>
                            </Box>
                        </Card>
                    </SignInContainer>
                </Box>
            </SectionCenteredChild>
        </>
    );
};

export default ResetPassword;
