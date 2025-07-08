import { alpha, createTheme, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        highlighted: true;
    }
}
declare module '@mui/material/styles' {
    interface ColorRange {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface PaletteColor extends ColorRange {}

    interface Palette {
        baseShadow: string;
    }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
    50: 'hsl(148, 100%, 96%)',
    100: 'hsl(148, 100%, 91%)',
    200: 'hsl(148, 100%, 81%)',
    300: 'hsl(148, 100%, 71%)',
    400: 'hsl(148, 100%, 61%)',
    500: 'hsl(148, 100%, 51%)',
    600: 'hsl(148, 100%, 41%)',
    700: 'hsl(148, 100%, 31%)',
    800: 'hsl(148, 100%, 21%)',
    900: 'hsl(148, 100%, 11%)', // green headline
};

export const gray = {
    50: 'hsl(0, 7%, 97%)',
    100: 'hsl(0, 7%, 92%)',
    200: 'hsl(0, 7%, 82%)',
    300: 'hsl(0, 7%, 72%)',
    400: 'hsl(0, 7%, 62%)',
    500: 'hsl(0, 7%, 52%)',
    600: 'hsl(0, 7%, 42%)',
    700: 'hsl(0, 7%, 32%)',
    800: 'hsl(0, 7%, 22%)', // paragraph
    900: 'hsl(0, 7%, 12%)', // headline
};

export const blue = {
    50: 'hsl(209, 100%, 97%)',
    100: 'hsl(209, 100%, 91%)',
    200: 'hsl(209, 100%, 81%)',
    300: 'hsl(209, 100%, 71%)',
    400: 'hsl(209, 100%, 61%)',
    500: 'hsl(209, 100%, 51%)',
    600: 'hsl(209, 100%, 41%)',
    700: 'hsl(209, 100%, 31%)',
    800: 'hsl(209, 100%, 21%)',
    900: 'hsl(209, 100%, 11%)',
};

export const orange = {
    50: 'hsl(45, 100%, 97%)',
    100: 'hsl(45, 92%, 90%)',
    200: 'hsl(45, 94%, 80%)',
    300: 'hsl(45, 90%, 65%)',
    400: 'hsl(45, 90%, 40%)',
    500: 'hsl(45, 90%, 35%)',
    600: 'hsl(45, 91%, 25%)',
    700: 'hsl(45, 94%, 20%)',
    800: 'hsl(45, 95%, 16%)',
    900: 'hsl(45, 93%, 12%)',
};

export const red = {
    50: 'hsl(328, 100%, 97%)',
    100: 'hsl(328, 100%, 91%)',
    200: 'hsl(328, 100%, 81%)',
    300: 'hsl(328, 100%, 61%)',
    400: 'hsl(328, 100%, 41%)',
    500: 'hsl(328, 100%, 31%)',
    600: 'hsl(328, 100%, 21%)',
    700: 'hsl(328, 100%, 11%)',
    800: 'hsl(328, 100%, 8%)',
    900: 'hsl(328, 100%, 5%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
    customShadows[1] =
        mode === 'dark'
            ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
            : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

    return {
        palette: {
            mode,
            primary: {
                light: brand[200],
                main: brand[400],
                dark: brand[700],
                contrastText: brand[50],
                ...(mode === 'dark' && {
                    contrastText: brand[50],
                    light: brand[300],
                    main: brand[400],
                    dark: brand[700],
                }),
            },
            info: {
                light: blue[100],
                main: blue[300],
                dark: blue[600],
                contrastText: gray[50],
                ...(mode === 'dark' && {
                    contrastText: blue[300],
                    light: blue[500],
                    main: blue[700],
                    dark: blue[900],
                }),
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
                ...(mode === 'dark' && {
                    light: orange[400],
                    main: orange[500],
                    dark: orange[700],
                }),
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
                ...(mode === 'dark' && {
                    light: red[400],
                    main: red[500],
                    dark: red[700],
                }),
            },
            success: {
                light: brand[300],
                main: brand[400],
                dark: brand[800],
                ...(mode === 'dark' && {
                    light: brand[400],
                    main: brand[500],
                    dark: brand[700],
                }),
            },
            grey: {
                ...gray,
            },
            divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%,99%)',
                paper: 'hsl(220, 35%, 97%)',
                ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
                ...(mode === 'dark' && {
                    primary: 'hsl(0, 0%, 100%)',
                    secondary: gray[400],
                }),
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
                ...(mode === 'dark' && {
                    hover: alpha(gray[600], 0.2),
                    selected: alpha(gray[600], 0.3),
                }),
            },
        },
        shape: {
            borderRadius: 8,
        },
        shadows: customShadows,
    };
};

export const colorSchemes = {
    light: {
        palette: {
            primary: {
                light: brand[200],
                main: brand[400],
                dark: brand[700],
                contrastText: brand[50],
            },
            info: {
                light: brand[100],
                main: brand[300],
                dark: brand[600],
                contrastText: gray[50],
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
            },
            error: {
                light: red[200],
                main: red[300],
                dark: red[500],
            },
            success: {
                light: brand[300],
                main: brand[400],
                dark: brand[800],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%, 100%)',
                paper: 'hsl(220, 35%, 97%)',
            },
            backgroundColor: {
                default: 'hsl(0, 0%, 100%)',
                paper: 'hsl(220, 35%, 97%)',
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
            },
            baseShadow:
                'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        },
    },
    dark: {
        palette: {
            primary: {
                contrastText: brand[50],
                light: brand[300],
                main: brand[400],
                dark: brand[700],
            },
            info: {
                contrastText: brand[300],
                light: brand[500],
                main: brand[700],
                dark: brand[900],
            },
            warning: {
                light: orange[400],
                main: orange[500],
                dark: orange[700],
            },
            error: {
                light: red[400],
                main: red[500],
                dark: red[700],
            },
            success: {
                light: brand[400],
                main: brand[500],
                dark: brand[700],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[700], 0.6),
            background: {
                default: gray[900],
                paper: 'hsl(220, 30%, 7%)',
            },
            text: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[400],
            },
            action: {
                hover: alpha(gray[600], 0.2),
                selected: alpha(gray[600], 0.3),
            },
            baseShadow:
                'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
        },
    },
};

export const shape = {
    borderRadius: 8,
};

// @ts-expect-error: Shadows type does not allow custom CSS variables
const defaultShadows: Shadows = [
    'none',
    'var(--template-palette-baseShadow)',
    ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
