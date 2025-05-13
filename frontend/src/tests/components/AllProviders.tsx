import { PropsWithChildren } from 'react';
import GlobalStylesProvider from '../../providers/GlobalStylesProvider';
import ReactQueryProvider from '../../providers/ReactQueryProvider';
import { default as ThemeProvider } from '../../themes/AppTheme';

const AllProviders = ({ children }: PropsWithChildren) => {
    return (
        <>
            <ThemeProvider>
                <ReactQueryProvider>
                    <GlobalStylesProvider />
                    {children}
                </ReactQueryProvider>
            </ThemeProvider>
        </>
    );
};

export default AllProviders;
