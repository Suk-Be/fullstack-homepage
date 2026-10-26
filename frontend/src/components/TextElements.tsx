import { typography } from '@/themes/themePrimitives';
import { SxProps, Theme, Typography } from '@mui/material';
import { ElementType, PropsWithChildren } from 'react';

// HomePage
interface LogoHPProps extends PropsWithChildren {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    color?: typeof typography.brand | typeof typography.brandDark;
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
    color = typography.brand,
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
    color?: typeof typography.brand | typeof typography.brandDark | typeof typography.brandDark;
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const Claim = ({
    fontSize = '2.5rem',
    color = typography.brand,
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
    color?: typeof typography.brand | typeof typography.brandDark | typeof typography.brandDark;
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
    return (
        <Typography
            component="p"
            sx={{
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
    color?: 'colorSecondary';
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
    const resolvedColor =
        color === 'colorSecondary' ? 'var(--template-palette-headline-colorSecondary)' : color;

    return (
        <Typography
            component={component}
            variant={variant}
            sx={{
                fontWeight: fontWeight,
                fontSize: fontSize,
                fontStyle: 'normal',
                color: resolvedColor,
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

interface ParagraphHPProps extends PropsWithChildren {
    component?: ElementType;
    marginTop?: string;
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const ParagraphHP = ({
    children,
    component = 'p',
    marginTop = '0px',
    marginBottom = '1rem',
    sx,
    ...rest
}: ParagraphHPProps) => {
    return (
        <Typography
            component={component}
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
