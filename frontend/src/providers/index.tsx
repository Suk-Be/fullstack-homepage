import CssBaseline from '@mui/material/CssBaseline';
import MUIThemeProvider from './MUIThemeProvider';
import ReactRouterProvider from './ReactRouterProvider';
import ReduxProvider from './ReduxProvider';

const Providers = () => {
    return (
        <ReduxProvider>
            <MUIThemeProvider>
                <CssBaseline enableColorScheme />
                <ReactRouterProvider />
            </MUIThemeProvider>
        </ReduxProvider>
    );
};

export default Providers;
