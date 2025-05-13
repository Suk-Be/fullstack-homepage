import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

// HomePage
interface LogoHPProps extends PropsWithChildren {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)';
    marginTop?: string;
    fontSize?: string;
    lineHeight?: string;
}
const Logo = ({
    component = 'h1',
    variant = 'h1',
    fontSize = '3rem',
    lineHeight = '1',
    color = 'rgba(56,255,148, 1)',
    marginTop = '0',
}: LogoHPProps) => {
    return (
        <Typography
            variant={variant}
            component={component}
            sx={{
                color: color,
                fontFamily: 'Eczar, serif',
                fontWeight: 800,
                fontSize: {
                    xs: fontSize,
                    md: `calc(${fontSize} * 0.75)`,
                    lg: fontSize,
                },
                fontStyle: 'normal',
                lineHeight: lineHeight,
                marginTop: marginTop,
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
                fontSize: {
                    xs: fontSize,
                    md: `calc(${fontSize} * 0.75)`,
                    lg: fontSize,
                },
                fontStyle: 'normal',
                marginBottom: marginBottom,
            }}
        >
            {children}
        </Typography>
    );
};

interface SubTitleProps extends PropsWithChildren {
    fontSize?: '0.8rem' | '1.3rem' | '2.5rem' | string;
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(33,29,29, 0.5)';
    marginBottom?: string;
}

const SubTitle = ({
    fontSize = '1.3rem',
    color = 'rgba(33,29,29, 0.5)',
    marginBottom = '1rem',
    children,
}: SubTitleProps) => {
    return (
        <Typography
            component="p"
            sx={{
                color: color,
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
    color,
    textAlign = 'center',
}: HeadlineHPPProps) => {
    return (
        <Typography
            component={component}
            variant={variant}
            sx={{
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
                fontStyle: 'normal',
                marginTop: marginTop,
                marginBottom: marginBottom,
            }}
        >
            {children}
        </Typography>
    );
};

export { Claim, HeadlineHP, Logo, ParagraphHP, SubTitle };
