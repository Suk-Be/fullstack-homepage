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
}

const Section = ({
    children,
    background = 'rgba(33,29,29, 1)',
    color = 'rgba(255,255,255, 1)',
    textAlign = 'left',
    padding = '2rem',
    paddingTop = '0',
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
                paddingTop: paddingTop,
            }}
        >
            {children}
        </Box>
    );
};

const SectionRelative = ({ children }: PropsWithChildren) => {
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
            }}
        >
            {children}
        </Box>
    );
};

const breakpointsContainer = {
    margin: '0 auto',
    height: '100vh',
    backgroundColor: 'transparent',
    width: {
        xs: '500px',
        sm: '800px',
        md: '1024px',
        lg: '1600px',
        xl: '1920px',
    },
};

const ResponsiveContainer = ({ children }: PropsWithChildren) => {
    return <Box sx={breakpointsContainer}>{children}</Box>;
};

export default SimpleContainer;
export { ResponsiveContainer, Section, SectionRelative };
