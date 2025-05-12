import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { PropsWithChildren } from 'react';

const SimpleContainer = ({ children }: PropsWithChildren) => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>{children}</Box>
        </Container>
    );
};

// HomePage

interface SectionProps extends PropsWithChildren {
    background?: string;
    color?: string;
    textAlign?: string;
    padding?: string;
    paddingTop?: string;
    paddingTopMd?: string;
    marginBottom?: string;
}

const Section = ({
    children,
    background = 'rgba(33,29,29, 1)',
    color = 'rgba(255,255,255, 1)',
    textAlign = 'left',
    padding = '2rem',
    paddingTop = '0',
    paddingTopMd = '0',
    marginBottom = '0',
}: SectionProps) => {
    return (
        <Box
            component="section"
            sx={{
                marginRight: '2rem',
                padding: padding,
                background: background,
                color: color,
                textAlign: textAlign,
                paddingTop: {
                    xs: paddingTop,
                    md: paddingTopMd,
                },
                marginBottom: marginBottom,
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
                maxWidth: 'calc(100%-2rem)',
                margin: '0 auto',
                padding: '2rem',
                marginRight: '2rem',
                position: 'relative',
                background: 'rgba(33,29,29, 1)',
                color: 'rgba(255,255,255, 1)',
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
    width: {
        xs: '500px',
        sm: '800px',
        md: '1024px',
        lg: '1600px',
        xl: '1920px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
};

const ResponsiveContainer = ({ children }: PropsWithChildren) => {
    return <Box sx={breakpointsContainer}>{children}</Box>;
};

export default SimpleContainer;
export { ResponsiveContainer, Section, SectionRelative };
