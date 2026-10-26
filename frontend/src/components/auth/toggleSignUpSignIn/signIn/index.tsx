import AuthHeaderLayout from '@/components/auth/auth-shared-components/AuthHeaderLayout';
import { AuthSocialButtons } from '@/components/auth/auth-shared-components/AuthSocialButtons';
import { ButtonDefault } from '@/components/auth/auth-shared-components/ButtonDefault';
import { LabeledTextField } from '@/components/auth/auth-shared-components/LabeledInputField';
import { LabeledPasswordField } from '@/components/auth/auth-shared-components/LabeledPasswordField';
import { Card, SignInContainer } from '@/components/ContainerElements';
import { useBoolean } from '@/hooks/useBoolean';
import { useInput } from '@/hooks/useInput';
import { useAppDispatch } from '@/store/hooks';
import { loginThunk } from '@/store/thunks/loginThunk';
import setResponseErrorMessage from '@/utils/auth/setResponseErrorMessage';
import { testId } from '@/utils/testId';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Divider } from '@mui/material';
import Link from '@mui/material/Link';
import { FormEvent, useState } from 'react';
import ForgotPassword from './ForgotPassword';
import { validateSignInInputs } from './validateSignInInputs';

interface FieldError {
    hasError: boolean;
    message: string;
}

interface ErrorState {
    email: FieldError;
    password: FieldError;
}

const SignIn = ({ onToggleAuth }: { onToggleAuth: () => void }) => {
    // input error states
    const [fieldErrors, setFieldErrors] = useState<ErrorState>({
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
    });

    // Clears the error state and removes rendered error for the given form field.
    // @example eamil field: clearFieldError('email');
    const clearFieldError = (field: keyof ErrorState) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
    };

    const inputs = {
        email: useInput('', { onChange: () => clearFieldError('email') }),
        password: useInput('', { onChange: () => clearFieldError('password') }),
    };

    const ui = {
        modal: useBoolean(),
        submitting: useBoolean(),
        showPassword: useBoolean(),
    };

    const dispatch = useAppDispatch();

    // execute validation, request, fields clearing and dispatches
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        ui.submitting.setTrue();

        setFieldErrors({
            email: { hasError: false, message: '' },
            password: { hasError: false, message: '' },
        });

        const { isValid, emailError, emailErrorMessage, passwordError, passwordErrorMessage } =
            validateSignInInputs({ email: inputs.email.value, password: inputs.password.value });

        setFieldErrors({
            email: { hasError: emailError, message: emailErrorMessage },
            password: { hasError: passwordError, message: passwordErrorMessage },
        });

        if (!isValid) {
            ui.submitting.setFalse();
            return;
        }

        // 🔄 Dynamischer Import von loginThunk
        const actionResult = await dispatch(
            loginThunk({ email: inputs.email.value, password: inputs.password.value }),
        );

        if (loginThunk.fulfilled.match(actionResult)) {
            inputs.email.setValue('');
            inputs.password.setValue('');
            setFieldErrors({
                email: { hasError: false, message: '' },
                password: { hasError: false, message: '' },
            });
        } else if (loginThunk.rejected.match(actionResult)) {
            const payload = actionResult.payload;

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

        ui.submitting.setFalse();
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
                        <LabeledTextField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="ihreEmail@mustermann.com"
                            autoComplete="email"
                            required
                            value={inputs.email.value}
                            onChange={inputs.email.onChange}
                            error={fieldErrors.email.hasError}
                            helperText={fieldErrors.email.message}
                            color={fieldErrors.email.hasError ? 'error' : 'primary'}
                        />

                        <LabeledPasswordField
                            id="password"
                            name="password"
                            label="Passwort"
                            value={inputs.password.value}
                            onChange={inputs.password.onChange}
                            error={fieldErrors.password.hasError}
                            helperText={fieldErrors.password.message}
                            show={ui.showPassword.value}
                            onToggleShow={ui.showPassword.toggle}
                            sx={{ pb: '1rem' }}
                        />

                        <ButtonDefault
                            isSubmitting={ui.submitting.value}
                            btnName="Anmelden"
                            testIdName="form-button-login"
                        />
                        <Link
                            component="button"
                            type="button"
                            onClick={ui.modal.setTrue}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            {...testId('mui-link')}
                        >
                            Benötigen Sie ein neues Passwort?
                        </Link>
                    </Box>

                    <Divider>oder</Divider>

                    <AuthSocialButtons mode="signin" />
                </Card>
                <ForgotPassword open={ui.modal.value} handleClose={ui.modal.setFalse} />
            </SignInContainer>
        </>
    );
};

export default SignIn;
