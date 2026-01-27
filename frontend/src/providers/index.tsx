import AuthInitializer from '@/providers/AuthInitializer';
import MUIThemeProvider from '@/providers/MUIThemeProvider';
import ReactRouterProvider from '@/providers/ReactRouterProvider';
import ReduxProvider from '@/providers/ReduxProvider';
import { useColorSchemeAttribute } from '@/themes/useColorSchemeAttribute';
import { loadRecaptchaScript } from '@/utils/recaptcha/recaptchaToken';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';

const Providers = () => {
    useColorSchemeAttribute();

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
