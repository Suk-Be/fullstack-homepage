import CssBaseline from '@mui/material/CssBaseline';
import AuthInitializer from './AuthInitializer';
import MUIThemeProvider from './MUIThemeProvider';
import ReactRouterProvider from './ReactRouterProvider';
import ReduxProvider from './ReduxProvider';

const Providers = () => {
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
