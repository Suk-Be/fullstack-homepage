import { Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { PropsWithChildren } from 'react';

// HomePage
interface LogoHPProps extends PropsWithChildren {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)';
    marginTop?: string;
    fontSize?: string;
    lineHeight?: string;
    sx?: SxProps<Theme>;
}
const Logo = ({
    component = 'h1',
    variant = 'h1',
    fontSize = '3rem',
    lineHeight = '1',
    color = 'rgba(56,255,148, 1)',
    marginTop = '0',
    sx,
    ...rest
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
                ...sx,
            }}
            {...rest}
        >
            Suk-Be Jang
        </Typography>
    );
};

interface ClaimProps extends PropsWithChildren {
    fontSize?: '0.8rem' | '1.3rem' | '2.5rem';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(33,29,29, 0.5)';
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const Claim = ({
    fontSize = '2.5rem',
    color = 'rgba(56,255,148, 1)',
    marginBottom = '1rem',
    children,
    sx,
    ...rest
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
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

interface SubTitleProps extends PropsWithChildren {
    fontSize?: '0.8rem' | '1.3rem' | '2.5rem' | string;
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(33,29,29, 0.5)';
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const SubTitle = ({
    fontSize = '1.3rem',
    marginBottom = '1rem',
    sx,
    children,
    ...rest
}: SubTitleProps) => {
    const theme = useTheme();
    return (
        <Typography
            component="p"
            sx={{
                color: alpha(theme.palette.grey[900], 0.5),
                fontSize: fontSize,
                fontStyle: 'normal',
                marginBottom: marginBottom,
                ...sx,
            }}
            {...rest}
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
    sx?: SxProps<Theme>;
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
    sx,
    ...rest
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
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

import { SxProps, Theme } from '@mui/material';

interface ParagraphHPProps extends PropsWithChildren {
    marginTop?: string;
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const ParagraphHP = ({
    children,
    marginTop = '0px',
    marginBottom = '1rem',
    sx,
    ...rest
}: ParagraphHPProps) => {
    return (
        <Typography
            component="p"
            sx={{
                fontStyle: 'normal',
                marginTop: marginTop,
                marginBottom: marginBottom,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

interface HeadlineSignInUpProps extends PropsWithChildren {
    sx?: SxProps<Theme>;
}

const HeadlineSignInUp = ({ children, sx, ...rest }: HeadlineSignInUpProps) => {
    return (
        <Typography
            component="h1"
            variant="h4"
            sx={{
                width: '100%',
                fontSize: 'clamp(1.3rem, 10vw, 2rem)',
                fontFamily: 'Eczar, serif',
                color: (theme) => theme.palette.primary.main,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

export { Claim, HeadlineHP, HeadlineSignInUp, Logo, ParagraphHP, SubTitle };
