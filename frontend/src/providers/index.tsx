import { loadRecaptchaScript } from '@/utils/recaptcha/recaptchaToken';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import AuthInitializer from './AuthInitializer';
import MUIThemeProvider from './MUIThemeProvider';
import ReactRouterProvider from './ReactRouterProvider';
import ReduxProvider from './ReduxProvider';

const Providers = () => {
    useEffect(() => {
        loadRecaptchaScript(); // Nur Skript preloaden – kein Token!
    }, []);

    return (
        <ReduxProvider>
            <AuthInitializer>
                <MUIThemeProvider>
                    <CssBaseline enableColorScheme />
                    <ReactRouterProvider />
                </MUIThemeProvider>
            </AuthInitializer>
        </ReduxProvider>
    );
};

export default Providers;
