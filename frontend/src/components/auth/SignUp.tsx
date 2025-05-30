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
import registerUser from '../../utils/registerUser';
import { testId } from '../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../ContainerElements';
import { FacebookIcon, GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import { HeadlineSignInUp, ParagraphHP } from '../TextElements';

export default function SignUp() {
    const [showPassword, toggleShowPassword] = useToggle();

    const [checked, setChecked] = useState(false);

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        if (nameError || emailError || passwordError || checked === false) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        const dataFD = new FormData(event.currentTarget);

        const logState = true;

        await registerUser({
            logState,
            name: (dataFD.get('name') as string) ?? '',
            email: (dataFD.get('email') as string) ?? '',
            password: (dataFD.get('password') as string) ?? '',
            password_confirmation: (dataFD.get('passwordConfirmation') as string) ?? '',
            // todo
            // terms and condition
        });
    };

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
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
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
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Github')}
                            startIcon={<GithubIcon />}
                            {...testId('form-button-register-with-github')}
                        >
                            registrieren mit Github
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon />}
                            {...testId('form-button-register-with-google')}
                        >
                            registrieren mit Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon />}
                            {...testId('form-button-register-with-facebook')}
                        >
                            registrieren mit Facebook
                        </Button>

                        <Typography
                            sx={{ textAlign: 'center' }}
                            {...testId('info-switch-to-login')}
                        >
                            Verfügen Sie über ein Konto?{' '}
                            <Link
                                href="/material-ui/getting-started/templates/sign-in/"
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
