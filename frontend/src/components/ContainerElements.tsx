import { Box, Card as MuiCard, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';

// HomePage

interface SectionProps extends PropsWithChildren {
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string | number;
    paddingTop?: string;
    paddingTopMd?: string;
    marginBottom?: string | number;
    height?: string | number;
}

const Section = ({
    children,
    textAlign = 'left',
    padding = '2rem',
    paddingTop = '0',
    paddingTopMd = '0',
    marginBottom = '0',
    height = 'auto',
}: SectionProps) => {
    return (
        <Box
            component="section"
            sx={{
                marginRight: '2rem',
                padding,
                backgroundColor: 'var(--template-palette-background-default)',
                color: 'var(--template-palette-text-primary)',
                textAlign,
                paddingTop: { xs: paddingTop, md: paddingTopMd },
                marginBottom,
                height,
            }}
        >
            {children}
        </Box>
    );
};

const SectionImage = ({
    children,
    textAlign = 'left',
    padding = '2rem',
    paddingTop = '0',
    paddingTopMd = '0',
    marginBottom = '0',
    height = 'auto',
}: SectionProps) => {
    return (
        <Box
            component="section"
            sx={{
                marginRight: '2rem',
                padding,
                backgroundColor: 'var(--template-palette-backgroundColorInverse-default)',
                color: 'var(--template-palette-textColorInverse-primary)',
                textAlign,
                paddingTop: { xs: paddingTop, md: paddingTopMd },
                marginBottom,
                height,
            }}
        >
            {children}
        </Box>
    );
};

const SectionCenteredChild = ({ children }: PropsWithChildren) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            {children}
        </Box>
    );
};

interface SectionRelativeProps extends PropsWithChildren {
    paddingBottom?: string;
}

const SectionRelative = ({ children, paddingBottom = '0px' }: SectionRelativeProps) => {
    return (
        <Box
            component="section"
            sx={{
                maxWidth: 'calc(100% - 2rem)',
                margin: '0 auto',
                padding: '2rem',
                marginRight: '2rem',
                position: 'relative',
                backgroundColor: 'var(--template-palette-backgroundColorInverse-default)',
                color: 'var(--template-palette-textColorInverse-primary)',

                textAlign: 'left',
                paddingBottom: {
                    md: paddingBottom,
                },
            }}
        >
            {children}
        </Box>
    );
};

const breakpointsContainer = {
    margin: '0 auto',
    backgroundColor: 'transparent',

    width: '100%',
    maxWidth: {
        sm: 800,
        md: 1024,
        lg: 1600,
        xl: 1920,
    },

    boxSizing: 'border-box',

    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
};

const ResponsiveContainer = ({ children }: PropsWithChildren) => {
    return <Box sx={breakpointsContainer}>{children}</Box>;
};

const SignInContainer = styled(Stack)(() => ({
    position: 'relative',
    minHeight: '100%',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundImage: 'var(--template-palette-backgroundImage-signIn)',
        backgroundRepeat: 'no-repeat',
        display: 'block',
    },
    marginBottom: '4rem',
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: '2rem',
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: 'var(--template-palette-boxShadow-card)',
}));

// export default SimpleContainer;
export {
    Card,
    ResponsiveContainer,
    Section,
    SectionCenteredChild,
    SectionImage,
    SectionRelative,
    SignInContainer,
};
