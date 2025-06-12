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
import { FormEvent, useState } from 'react';
import useSignUpValidateInputs from '../../hooks/useSignUpValidation';
import useToggle from '../../hooks/useToggle';
import registerUser from '../../utils/auth/SignUp';
import { handleSignInUp as handleSignUp } from '../../utils/clickHandler';
import { testId } from '../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../ContainerElements';
import { GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import { ParagraphHP } from '../TextElements';
import AuthHeaderLayout from './AuthHeaderLayout';
import RegisterButtonSocialite from './RegisterButtonSocialite';

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    const [showPassword, toggleShowPassword] = useToggle();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const {
        emailError,
        emailErrorMessage,
        passwordError,
        passwordErrorMessage,
        passwordConfirmationError,
        passwordConfirmationErrorMessage,
        nameError,
        nameErrorMessage,
        validateInputs,
    } = useSignUpValidateInputs();

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        // Run validation here
        const isValid = validateInputs();
        // do not submit if validation fails
        if (!isValid) {
            return;
        }

        const form = event.currentTarget;
        const dataFD = new FormData(form);

        // islog : true logs the registered user data right after registration
        const result = await registerUser({
            islog: false,
            name: (dataFD.get('name') as string) ?? '',
            email: (dataFD.get('email') as string) ?? '',
            password: (dataFD.get('password') as string) ?? '',
            password_confirmation: (dataFD.get('passwordConfirmation') as string) ?? '',
        });

        if (result.success) {
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
        } else {
            setErrors({ email: [result.message] });
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        {...testId('form')}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">User Name</FormLabel>
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
                                onChange={(e) => setName(e.target.value)}
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
                                helperText={
                                    emailErrorMessage ? (
                                        <span data-testid="email-input-error">
                                            {emailErrorMessage}
                                        </span>
                                    ) : errors.email ? (
                                        <span data-testid="email-exists-error">
                                            {errors.email[0]}
                                        </span>
                                    ) : null
                                }
                                color={passwordError ? 'error' : 'primary'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                                    onClick={toggleShowPassword}
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
                                onChange={(e) => setPassword(e.target.value)}
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
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                {...testId('form-input-password-confirmation')}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                            {...testId('form-button-register')}
                        >
                            registrieren
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
