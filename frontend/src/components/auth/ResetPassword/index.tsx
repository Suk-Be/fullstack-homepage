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
import { useLocation, useNavigate } from 'react-router-dom'; // Angenommen, Sie verwenden React Router
import { ZodError } from 'zod';
import {
    ResetPasswordFormattedErrors,
    ResetPasswordSchema,
} from '../../../schemas/resetPasswordSchema';
import setResponseErrorMessage from '../../../utils/auth/setResponseErrorMessage'; // Ihre bestehende Funktion
import { Card, SectionCenteredChild, SignInContainer } from '../../ContainerElements';
import resetPassword from './requestResetPassword';

type FieldError = {
    hasError: boolean;
    message: string;
};

type FormErrors = {
    email: FieldError;
    password: FieldError;
    password_confirmation: FieldError;
};

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<FormErrors>({
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
        password_confirmation: { hasError: false, message: '' },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [generalErrorMessage, setGeneralErrorMessage] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

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
            setGeneralErrorMessage('Ungültiger oder fehlender Passwort-Reset-Token.');
        }
        if (urlEmail) {
            setEmail(urlEmail);
        }
    }, [location.search]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({
            email: { hasError: false, message: '' },
            password: { hasError: false, message: '' },
            password_confirmation: { hasError: false, message: '' },
        });
        setSuccessMessage(null);
        setGeneralErrorMessage(null);

        if (!token) {
            setGeneralErrorMessage('Passwort-Reset-Token fehlt.');
            setIsSubmitting(false);
            return;
        }

        try {
            ResetPasswordSchema.parse({
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                const formatted: ResetPasswordFormattedErrors = error.format();
                setFieldErrors({
                    email: {
                        hasError: Boolean(formatted.email?._errors?.[0]),
                        message: formatted.email?._errors?.[0] || '',
                    },
                    password: {
                        hasError: Boolean(formatted.password?._errors?.[0]),
                        message: formatted.password?._errors?.[0] || '',
                    },
                    password_confirmation: {
                        hasError: Boolean(formatted.password_confirmation?._errors?.[0]),
                        message: formatted.password_confirmation?._errors?.[0] || '',
                    },
                });
            }
            setIsSubmitting(false);
            return;
        }

        const result = await resetPassword(email, password, passwordConfirmation, token);

        if (result.success) {
            setSuccessMessage(result.message || 'Passwort wurde erfolgreich zurückgesetzt!');
            // Optional: Nach einer kurzen Verzögerung zur Anmeldeseite navigieren
            setTimeout(() => navigate('/'), 3000);
        } else {
            const backendRawErrors = result.errors || {};
            // General error message for the whole form, or specific field errors
            if (backendRawErrors.general && backendRawErrors.general.length > 0) {
                setGeneralErrorMessage(backendRawErrors.general[0]);
            } else if (result.message) {
                setGeneralErrorMessage(result.message);
            }

            setFieldErrors({
                email: {
                    hasError: !!setResponseErrorMessage(backendRawErrors, 'email', ''),
                    message: setResponseErrorMessage(backendRawErrors, 'email', ''),
                },
                password: {
                    hasError: !!setResponseErrorMessage(backendRawErrors, 'password', ''),
                    message: setResponseErrorMessage(backendRawErrors, 'password', ''),
                },
                password_confirmation: {
                    hasError: !!setResponseErrorMessage(
                        backendRawErrors,
                        'password_confirmation',
                        '',
                    ),
                    message: setResponseErrorMessage(backendRawErrors, 'password_confirmation', ''),
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
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearFieldError('email');
                                        }}
                                        error={fieldErrors.email.hasError}
                                        helperText={fieldErrors.email.message}
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
