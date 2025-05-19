import { Visibility, VisibilityOff } from '@mui/icons-material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { IconButton, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, useState } from 'react';
import registerUser from '../../utilitites/registerUser';
import { Card, SignInContainer as SignUpContainer } from '../ContainerElements';
import { FacebookIcon, GithubIcon, GoogleIcon } from '../shared-components/CustomIcons';
import { HeadlineSignInUp, ParagraphHP } from '../TextElements';

export default function SignUp() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const passwordConfirmation = document.getElementById(
            'passwordConfirmation',
        ) as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Bitte geben Sie eine nutzbare Email Adresse an.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Das Passwort benötigt minimum 8 Zeichen.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!passwordConfirmation.value || passwordConfirmation.value != password.value) {
            setPasswordConfirmationError(true);
            setPasswordConfirmationErrorMessage(
                'Die Passwort Wiederholung stimmt nicht mit dem vergebenen Passwort überein.',
            );
            isValid = false;
        } else {
            setPasswordConfirmationError(false);
            setPasswordConfirmationErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Bitte geben Sie Ihren Name an.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        console.log('form', {
            name: name.value,
            email: email.value,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value,
            isValid: isValid,
        });

        return isValid;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        if (nameError || emailError || passwordError) {
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
        });
    };

    return (
        <>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <HowToRegIcon sx={{ color: (theme) => theme.palette.primary.main }} />
                    <HeadlineSignInUp>Registrierung</HeadlineSignInUp>
                    <ParagraphHP marginTop="1rem">
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
                            <FormLabel htmlFor="name">Vor- und Nachname</FormLabel>
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
                            <FormLabel htmlFor="password">Password</FormLabel>
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
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
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
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="Ich habe die Bedingungen gelesen nund stimme zu"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
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
                        >
                            registrieren mit Github
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            registrieren mit Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon />}
                        >
                            registrieren mit Facebook
                        </Button>

                        <Typography sx={{ textAlign: 'center' }}>
                            Verfügen Sie über ein Konto?{' '}
                            <Link
                                href="/material-ui/getting-started/templates/sign-in/"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
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
