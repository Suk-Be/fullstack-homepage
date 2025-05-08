import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

// HomePage
interface LogoHPProps extends PropsWithChildren {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    fontSize?: string;
    lineHeight?: string;
}
const Logo = ({
    component = 'h1',
    variant = 'h1',
    fontSize = '3rem',
    lineHeight = '1',
}: LogoHPProps) => {
    return (
        <Typography
            variant={variant}
            component={component}
            sx={{
                color: 'rgb(56,255,148)',
                fontFamily: 'Eczar, serif',
                fontWeight: 800,
                fontSize: fontSize,
                fontStyle: 'normal',
                lineHeight: lineHeight,
            }}
        >
            Suk-Be Jang
        </Typography>
    );
};

interface ClaimProps extends PropsWithChildren {
    fontSize?: '0.8rem' | '1.3rem' | '2.5rem';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(33,29,29, 0.5)';
    marginBottom?: string;
}

const Claim = ({
    fontSize = '2.5rem',
    color = 'rgba(56,255,148, 1)',
    marginBottom = '1rem',
    children,
}: ClaimProps) => {
    return (
        <Typography
            component="p"
            sx={{
                color: color,
                fontFamily: 'Fira Sans',
                fontWeight: 300,
                fontSize: fontSize,
                fontStyle: 'normal',
                marginBottom: marginBottom,
            }}
        >
            {children}
        </Typography>
    );
};

interface HeadlineHPPProps extends PropsWithChildren {
    fontSize?: string;
    marginBottom?: string;
    fontWeight?: 600 | 300;
    textAlign?: 'left' | 'center' | 'right';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(53,102,64, 1)';
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const HeadlineHP = ({
    children,
    fontSize = '1.3rem',
    marginBottom = '1rem',
    variant = 'h2',
    component = 'h3',
    fontWeight = 600,
    color = 'rgba(33,29,29, 1)',
    textAlign = 'center',
}: HeadlineHPPProps) => {
    return (
        <Typography
            component={component}
            variant={variant}
            sx={{
                fontFamily: 'Fira Sans',
                fontWeight: fontWeight,
                fontSize: fontSize,
                fontStyle: 'normal',
                color: color,
                marginBottom: marginBottom,
                textAlign: textAlign,
            }}
        >
            {children}
        </Typography>
    );
};

interface ParagraphHPProps extends PropsWithChildren {
    marginTop?: string;
    marginBottom?: string;
}

const ParagraphHP = ({ children, marginTop = '0px', marginBottom = '1rem' }: ParagraphHPProps) => {
    return (
        <Typography
            component="p"
            sx={{
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

export { Claim, HeadlineHP, Logo, ParagraphHP };
