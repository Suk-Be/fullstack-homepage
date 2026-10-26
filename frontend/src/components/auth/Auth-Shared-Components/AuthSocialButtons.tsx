import RegisterButtonSocialite from '@/components/auth/auth-shared-components/RegisterButtonSocialite';
import { GithubIcon, GoogleIcon } from '@/components/icons/CustomIcons';
import { handleSignInUp } from '@/utils/clickHandler';
import { Box } from '@mui/material';

type AuthMode = 'signin' | 'signup';

type Props = {
    mode: AuthMode;
};

export function AuthSocialButtons({ mode }: Props) {
    const isSignUp = mode === 'signup';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RegisterButtonSocialite
                startIcon={<GithubIcon />}
                text={isSignUp ? 'registrieren mit Github' : 'Anmelden mit Github'}
                testIdIdentifier={
                    isSignUp ? 'form-button-register-with-github' : 'form-button-login-with-github'
                }
                clickHandler={() => handleSignInUp('github')}
            />

            <RegisterButtonSocialite
                startIcon={<GoogleIcon />}
                text={isSignUp ? 'registrieren mit Google' : 'Anmelden mit Google'}
                testIdIdentifier={
                    isSignUp ? 'form-button-register-with-google' : 'form-button-login-with-google'
                }
                clickHandler={() => handleSignInUp('google')}
            />
        </Box>
    );
}
