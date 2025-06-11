import { HowToReg as HowToRegIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import useToggle from '../../hooks/useToggle';
import useValidateInputs from '../../hooks/useValidation';
import apiBaseUrl from '../../utils/apiBaseUrl';
import registerUser from '../../utils/registerUser';
import { testId } from '../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../ContainerElements';
import { GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import { HeadlineSignInUp, ParagraphHP } from '../TextElements';
import RegisterButtonSocialite from './RegisterButtonSocialite';

export default function SignUp({ onToggleAuth }: { onToggleAuth: () => void }) {
    const [showPassword, toggleShowPassword] = useToggle();
    const [checked, setChecked] = useState(false);
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
        checkedErrorMessage,
        validateInputs,
    } = useValidateInputs(checked);

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        // Run validation here
        const isValid = validateInputs();
        // do not submit if validation fails
        if (!isValid || checked === false) {
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
            // todo
            // confirmation of terms and condition
        });

        if (result.success) {
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
            setChecked(false);
        } else {
            setErrors({ email: [result.message] });
        }
    };

    const handleSignUp = (provider: string) => {
        window.location.href = `${apiBaseUrl}/auth/${provider}`;
    };

    console.log('toggleSignUp', onToggleAuth);

    return (
        <>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <HowToRegIcon sx={{ color: (theme) => theme.palette.primary.main }} />
                    <HeadlineSignInUp {...testId('title-sign-up')}>Registrierung</HeadlineSignInUp>
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="allowExtraEmails"
                                    color="primary"
                                    checked={checked}
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                            }
                            label="Ich habe die Bedingungen gelesen nund stimme zu"
                            {...testId('form-label-condition')}
                        />
                        {checkedErrorMessage && (
                            <FormHelperText
                                sx={{
                                    color: (theme) => theme.palette.error.main,
                                    marginTop: '-1rem',
                                    marginLeft: '1rem',
                                }}
                            >
                                {checkedErrorMessage}
                            </FormHelperText>
                        )}

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

                        <Typography
                            sx={{ textAlign: 'center' }}
                            {...testId('info-switch-to-login')}
                        >
                            Verfügen Sie über ein Konto?{' '}
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onToggleAuth();
                                }}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                                {...testId('button-switch-to-login')}
                            >
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </>
    );
}
