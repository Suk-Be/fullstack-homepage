import { PropsWithChildren } from 'react';
import ReactQueryProvider from '../../providers/ReactQueryProvider';
import { default as ThemeProvider } from '../../themes/AppTheme';

const AllProviders = ({ children }: PropsWithChildren) => {
    return (
        <>
            <ThemeProvider>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </ThemeProvider>
        </>
    );
};

export default AllProviders;
