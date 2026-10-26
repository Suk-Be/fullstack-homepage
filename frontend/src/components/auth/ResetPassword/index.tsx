import { LabeledTextField } from '@/components/auth/auth-shared-components/LabeledInputField';
import { LabeledPasswordField } from '@/components/auth/auth-shared-components/LabeledPasswordField';
import resetPassword from '@/components/auth/requests/requestResetPassword';
import { Card, SectionCenteredChild, SignInContainer } from '@/components/ContainerElements';
import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import { useBoolean } from '@/hooks/useBoolean';
import { useInput } from '@/hooks/useInput';
import { useResponse } from '@/hooks/useResponse';
import setResponseErrorMessage from '@/utils/auth/setResponseErrorMessage'; // Ihre bestehende Funktion
import { testId } from '@/utils/testId';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Button, Typography } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Angenommen, Sie verwenden React Router
import validateInputs from './validateResetPassPassword';

interface FieldError {
    hasError: boolean;
    message: string;
}

interface FormErrors {
    password: FieldError;
    password_confirmation: FieldError;
}

const ResetPassword = () => {
    // url related
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    const resMessage = useResponse();

    // input error states
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({
        password: { hasError: false, message: '' },
        password_confirmation: { hasError: false, message: '' },
    });

    const clearFieldError = (field: keyof FormErrors) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
        resMessage.error.clear(); // Clear general error message when typing
    };

    // input field states
    const inputs = {
        password: useInput('', { onChange: () => clearFieldError('password') }),
        password_confirmation: useInput('', {
            onChange: () => clearFieldError('password_confirmation'),
        }),
    };

    const ui = {
        submitting: useBoolean(),
        showPassword: useBoolean(),
        showPasswordConfirmation: useBoolean(),
    };

    // Extrahiere Token und E-Mail aus der URL bei Komponenten-Mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get('token');
        const urlEmail = queryParams.get('email');

        if (urlToken) {
            setToken(urlToken);
        } else {
            resMessage.error.set(ErrorMessages.ResetPassword.urlToken);
        }
        if (urlEmail) {
            setEmail(urlEmail);
        }
    }, [location.search]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // resets
        event.preventDefault();
        ui.submitting.setTrue();
        setFieldErrors({
            password: { hasError: false, message: '' },
            password_confirmation: { hasError: false, message: '' },
        });
        resMessage.success.clear();
        resMessage.error.clear();

        const {
            isValid,
            passwordError,
            passwordErrorMessage,
            passwordConfirmationError,
            passwordConfirmationErrorMessage,
            tokenError,
            tokenErrorMessage,
        } = validateInputs({
            password: inputs.password.value,
            password_confirmation: inputs.password_confirmation.value,
            token: token ?? '',
        });

        setFieldErrors({
            password: {
                hasError: passwordError,
                message: passwordErrorMessage,
            },
            password_confirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        // without token
        if (tokenError) {
            resMessage.error.set(tokenErrorMessage);
            ui.submitting.setFalse();
            return;
        }

        setFieldErrors({
            password: {
                hasError: passwordError,
                message: passwordErrorMessage,
            },
            password_confirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        if (!isValid) {
            ui.submitting.setFalse();
            return;
        }

        const result = await resetPassword(
            email,
            inputs.password.value,
            inputs.password_confirmation.value,
            token as string,
        );

        if (result.success) {
            resMessage.success.set(result.message || SuccessMessages.ResetPassword.requestSuccess);

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
        ui.submitting.setFalse();
    };

    if (resMessage.error.value && !token) {
        // Zeigt Fehler an, wenn Token fehlt, bevor das Formular überhaupt gerendert wird
        return (
            <SignInContainer>
                <Card>
                    <Typography variant="h5" color="error">
                        {resMessage.error.value}
                    </Typography>
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
                                <LabeledTextField
                                    id="email-reset"
                                    name="email"
                                    label="E-Mail-Adresse"
                                    type="email"
                                    placeholder="Ihre@email.com"
                                    required
                                    disabled
                                    value={email}
                                    testId={testId('email-disabled')}
                                />
                                <LabeledPasswordField
                                    id="password-reset"
                                    name="password"
                                    label="Neues Passwort"
                                    value={inputs.password.value}
                                    onChange={inputs.password.onChange}
                                    error={fieldErrors.password.hasError}
                                    helperText={fieldErrors.password.message}
                                    show={ui.showPassword.value}
                                    onToggleShow={ui.showPassword.toggle}
                                />
                                <LabeledPasswordField
                                    id="password-confirmation-reset"
                                    name="password_confirmation"
                                    label="Passwort bestätigen"
                                    value={inputs.password_confirmation.value}
                                    onChange={inputs.password_confirmation.onChange}
                                    error={fieldErrors.password_confirmation.hasError}
                                    helperText={fieldErrors.password_confirmation.message}
                                    show={ui.showPasswordConfirmation.value}
                                    onToggleShow={ui.showPasswordConfirmation.toggle}
                                />

                                {resMessage.error.value && (
                                    <Typography color="error" sx={{ mt: 2 }}>
                                        {resMessage.error.value}
                                    </Typography>
                                )}
                                {resMessage.success.value && (
                                    <Typography color="success.main" sx={{ mt: 2 }}>
                                        {resMessage.success.value}
                                    </Typography>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={ui.submitting.value}
                                    sx={{ mt: 3, mb: 2 }}
                                    {...testId('submit-reset-password')}
                                >
                                    {ui.submitting.value
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
