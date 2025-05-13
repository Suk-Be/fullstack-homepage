import type { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import dataDisplayCustomizations from './customizations/dataDisplay';
import feedbackCustomizations from './customizations/feedback';
import inputsCustomizations from './customizations/inputs';
import routerLinkCustomizations from './customizations/linkRouter';
import navigationCustomizations from './customizations/navigation';
import surfacesCustomizations from './customizations/surfaces';
import { colorSchemes, shadows, shape } from './themePrimitives';

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  breakpoints: {
                      values: {
                          xs: 500,
                          sm: 800,
                          md: 1024,
                          lg: 1600,
                          xl: 1920,
                      },
                  },
                  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                  cssVariables: {
                      colorSchemeSelector: 'data-mui-color-scheme',
                      cssVarPrefix: 'template',
                  },
                  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                  typography: {
                      fontFamily: ['Fira Sans', 'sans-serif'].join(','),
                  },
                  shadows,
                  shape,
                  components: {
                      MuiCssBaseline: {
                          styleOverrides: `
                            @font-face {
                                font-family: 'Fira Sans';
                                font-style: normal;
                                font-display: swap;
                                font-weight: 400;
                                src: url('https://fonts.googleapis.com/css2?family=Eczar:wght@400..800&family=Fira+Sans:wght@100;200;300;400&display=swap') format('woff2');
                              }
                          `,
                      },
                      ...inputsCustomizations,
                      ...dataDisplayCustomizations,
                      ...feedbackCustomizations,
                      ...navigationCustomizations,
                      ...surfacesCustomizations,
                      ...themeComponents,
                      ...routerLinkCustomizations,
                  },
              });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
