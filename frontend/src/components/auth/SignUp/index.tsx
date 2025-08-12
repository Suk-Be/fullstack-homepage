import AuthHeaderLayout from '@/components/auth/shared-components/AuthHeaderLayout';
import RegisterButtonSocialite from '@/components/auth/shared-components/RegisterButtonSocialite';
import { Card, SignInContainer as SignUpContainer } from '@/components/ContainerElements';
import { GithubIcon, GoogleIcon } from '@/components/shared-components/CustomIcons';
import { ParagraphHP } from '@/components/TextElements';
import useToggle from '@/hooks/useToggle';
import { AppDispatch } from '@/store';
import { forceLogin, logout } from '@/store/loginSlice';
import { handleSignInUp as handleSignUp } from '@/utils/clickHandler';
import { testId } from '@/utils/testId';
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
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestRegister from '../api/requestRegister';
import validateInputs from './validateSignUpInputs';

type ErrorState = {
    hasError: boolean;
    message: string;
};

type FrontendErrorsState = {
    name: ErrorState;
    email: ErrorState;
    password: ErrorState;
    password_confirmation: ErrorState;
};

type FrontendField = keyof FrontendErrorsState;

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type ValidationErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    // laravel expects snake case and naming convention: password_confirmation
    const [form, setForm] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const createErrorState = () => ({ hasError: false, message: '' });
    const [fieldErrors, setFieldErrors] = useState<FrontendErrorsState>({
        name: createErrorState(),
        email: createErrorState(),
        password: createErrorState(),
        password_confirmation: createErrorState(),
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showPassword, handleTogglePassword] = useToggle();

    const dispatch: AppDispatch = useDispatch();

    // execute validations, submit and clearing fields
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

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
        } = validateInputs(form);

        setFieldErrors({
            name: { hasError: nameError, message: nameErrorMessage },
            email: { hasError: emailError, message: emailErrorMessage },
            password: { hasError: passwordError, message: passwordErrorMessage },
            password_confirmation: {
                hasError: passwordConfirmationError,
                message: passwordConfirmationErrorMessage,
            },
        });

        // do not submit if validation fails
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        const result = await requestRegister({
            form,
        });

        if (result.success) {
            dispatch(forceLogin(result.userId!));
            setForm({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });
            setFieldErrors({
                name: { hasError: false, message: '' },
                email: { hasError: false, message: '' },
                password: { hasError: false, message: '' },
                password_confirmation: { hasError: false, message: '' },
            });
        } else {
            const errors = result.fieldErrors || {};
            Object.entries(errors).forEach(([field, messages]) => {
                const key = field as FrontendField;
                setFieldErrors((prev) => ({
                    ...prev,
                    [key]: {
                        hasError: true,
                        message: messages[0] ?? 'Ungültiger Wert',
                    },
                }));
            });
            dispatch(logout());
        }

        setIsSubmitting(false);
    };

    /**
     * Clears the error state for a specific form field.
     * @param {keyof ErrorState} field - The name of the field whose error state should be cleared.
     *
     * @example
     * clearFieldError('email');
     */
    const clearFieldError = (field: FrontendField) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
        setErrors((prev) => {
            const { [field]: _ignored, ...rest } = prev;
            return rest;
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name in fieldErrors) {
            clearFieldError(name as FrontendField);
        }
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
                                autoFocus
                                required
                                fullWidth
                                id="name"
                                placeholder="Max Mustermann"
                                error={fieldErrors.name.hasError}
                                helperText={fieldErrors.name.message}
                                color={fieldErrors.name.hasError ? 'error' : 'primary'}
                                value={form.name}
                                onChange={handleChange}
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
                                helperText={
                                    fieldErrors.email.hasError ? (
                                        <span {...testId('email-error')}>
                                            {fieldErrors.email.message}
                                        </span>
                                    ) : null
                                }
                                color={fieldErrors.email.hasError ? 'error' : 'primary'}
                                value={form.email}
                                onChange={handleChange}
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
                                value={form.password}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password_confirmation">
                                Passwort Bestätigung
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password_confirmation"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password_confirmation"
                                autoComplete="new-password"
                                variant="outlined"
                                error={fieldErrors.password_confirmation.hasError}
                                helperText={fieldErrors.password_confirmation.message}
                                color={
                                    fieldErrors.password_confirmation.hasError ? 'error' : 'primary'
                                }
                                value={form.password_confirmation}
                                onChange={handleChange}
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
