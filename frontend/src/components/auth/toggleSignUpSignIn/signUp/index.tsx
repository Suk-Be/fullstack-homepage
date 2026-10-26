import AuthHeaderLayout from '@/components/auth/auth-shared-components/AuthHeaderLayout';
import { AuthSocialButtons } from '@/components/auth/auth-shared-components/AuthSocialButtons';
import { ButtonDefault } from '@/components/auth/auth-shared-components/ButtonDefault';
import { LabeledTextField } from '@/components/auth/auth-shared-components/LabeledInputField';
import { LabeledPasswordField } from '@/components/auth/auth-shared-components/LabeledPasswordField';
import requestRegister from '@/components/auth/requests/requestRegister';
import { Card, SignInContainer as SignUpContainer } from '@/components/ContainerElements';
import { ParagraphHP } from '@/components/TextElements';
import { useBoolean } from '@/hooks/useBoolean';
import { AppDispatch } from '@/store';
import { logout } from '@/store/loginSlice';
import { dispatchForceLogin } from '@/utils/redux/dispatchHelper';
import { sanitizeWithFeedback } from '@/utils/sanitizeInput';
import { testId } from '@/utils/testId';
import { HowToReg as HowToRegIcon } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import validateInputs from './validateSignUpInputs';

interface ErrorState {
    hasError: boolean;
    message: string;
}

interface FrontendErrorsState {
    name: ErrorState;
    email: ErrorState;
    password: ErrorState;
    password_confirmation: ErrorState;
}

type FrontendField = keyof FrontendErrorsState;

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

type ValidationErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    const createErrorState = () => ({
        hasError: false,
        message: '',
    });

    // laravel expects snake case and naming convention: password_confirmation
    const [form, setForm] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [_, setErrors] = useState<ValidationErrors>({});

    const [fieldErrors, setFieldErrors] = useState<FrontendErrorsState>({
        name: createErrorState(),
        email: createErrorState(),
        password: createErrorState(),
        password_confirmation: createErrorState(),
    });

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
            // eslint-disable-next-line  @typescript-eslint/no-unused-vars
            const { [field]: _ignored, ...rest } = prev;
            return rest;
        });
    };

    const ui = {
        submitting: useBoolean(),
        showPassword: useBoolean(),
    };

    const dispatch: AppDispatch = useDispatch();

    // execute validations, submit and clearing fields
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        ui.submitting.setTrue();
        setErrors({});

        // sanitize the name field with feedback
        const sanitizedName = sanitizeWithFeedback({
            value: form.name,
            setValue: (val) => setForm((prev) => ({ ...prev, name: val })),
            setError: (msg) =>
                setFieldErrors((prev) => ({
                    ...prev,
                    name: { hasError: true, message: msg },
                })),
            friendlyMessage: `Der Name wurde angepasst. Wenn es ok für Sie ist, klicken Sie bitte auf registrieren.`,
        });

        if (sanitizedName) {
            ui.submitting.setFalse();
            return;
        }

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
            ui.submitting.setFalse();
            return;
        }

        const result = await requestRegister({
            form,
        });

        if (result.success) {
            dispatchForceLogin(dispatch, result.userId!, result.role!);
            // UserId in der Slice setzen, damit neue Grids korrekt gespeichert werden
            // dispatch(setUserIdForGrids(result.userId!));

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

        ui.submitting.setFalse();
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
                        <LabeledTextField
                            id="name"
                            name="name"
                            label="Benutzername"
                            type="text"
                            placeholder="Max Mustermann"
                            autoComplete="name"
                            autoFocus
                            required
                            value={form.name}
                            onChange={handleChange}
                            error={fieldErrors.name.hasError}
                            helperText={fieldErrors.name.message}
                            color={fieldErrors.name.hasError ? 'error' : 'primary'}
                        />
                        <LabeledTextField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="max@mustermann.com"
                            autoComplete="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            error={fieldErrors.email.hasError}
                            helperText={fieldErrors.email.message}
                            color={fieldErrors.email.hasError ? 'error' : 'primary'}
                        />
                        <LabeledPasswordField
                            id="password"
                            name="password"
                            label="Passwort"
                            value={form.password}
                            onChange={handleChange}
                            error={fieldErrors.password.hasError}
                            helperText={fieldErrors.password.message}
                            show={ui.showPassword.value}
                            onToggleShow={ui.showPassword.toggle}
                        />
                        <LabeledPasswordField
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Passwort Bestätigung"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            error={fieldErrors.password_confirmation.hasError}
                            helperText={fieldErrors.password_confirmation.message}
                            show={ui.showPassword.value}
                            onToggleShow={ui.showPassword.toggle}
                            testId={testId('form-input-password-confirmation')}
                        />
                        <ButtonDefault
                            isSubmitting={ui.submitting.value}
                            btnName="Registrieren"
                            testIdName="form-button-register"
                        />
                    </Box>

                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>oder</Typography>
                    </Divider>

                    <AuthSocialButtons mode="signup" />
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
                </Card>
            </SignUpContainer>
        </>
    );
}
