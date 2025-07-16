import { default as ThemeProvider } from '@/themes/AppTheme';
import { PropsWithChildren } from 'react';

const MUIThemeProvider = ({ children }: PropsWithChildren) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};

export default MUIThemeProvider;
