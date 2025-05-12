import { ThemeProvider } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import GlobalStylesProvider from '../../providers/GlobalStylesProvider';
import ReactQueryProvider from '../../providers/ReactQueryProvider';
import theme from '../../themes/CustomThemes';

const AllProviders = ({ children }: PropsWithChildren) => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <ReactQueryProvider>
                    <GlobalStylesProvider />
                    {children}
                </ReactQueryProvider>
            </ThemeProvider>
        </>
    );
};

export default AllProviders;
