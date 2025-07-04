import { PropsWithChildren } from 'react';
import { default as ThemeProvider } from '../themes/AppTheme';

const MUIThemeProvider = ({ children }: PropsWithChildren) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};

export default MUIThemeProvider;
