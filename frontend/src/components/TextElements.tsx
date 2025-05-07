import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface ParagraphHPProps extends PropsWithChildren {
    marginTop?: string;
    marginBottom?: string;
}

// HomePage
const LogoHP = () => {
    return (
        <Typography
            variant="h4"
            component="h1"
            sx={{
                color: 'rgb(56,255,148)',
                fontFamily: 'Eczar, serif',
                fontWeight: 800,
                fontSize: '3rem',
                fontStyle: 'normal',
            }}
        >
            Suk-Be Jang
        </Typography>
    );
};

const LogoClaim = () => {
    return (
        <Typography
            variant="h4"
            component="h2"
            sx={{
                color: 'rgb(56,255,148)',
                fontFamily: 'Fira Sans',
                fontWeight: 300,
                fontSize: '2.5rem',
                fontStyle: 'normal',
                marginBottom: '1rem',
            }}
        >
            (Web Developer)
        </Typography>
    );
};

const ParagraphHP = ({ children, marginTop = '0px', marginBottom = '1rem' }: ParagraphHPProps) => {
    return (
        <Typography
            component="p"
            sx={{
                color: 'rgb(255,255,255)',
                fontFamily: 'Fira Sans',
                fontWeight: 300,
                fontSize: '1rem',
                fontStyle: 'normal',
                marginTop: marginTop,
                marginBottom: marginBottom,
            }}
        >
            {children}
        </Typography>
    );
};

export { LogoClaim, LogoHP, ParagraphHP };
