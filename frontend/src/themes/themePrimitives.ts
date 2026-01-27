/**
 * themePrimitives.ts (MUI v6 + CSS Variables)
 *
 * Zweck
 * - Zentrale Ablage der Farb-/Style-Tokens für Light/Dark (`colorSchemes`).
 * - Komponenten sollen möglichst nur Theme-Werte lesen (keine hardcoded HSL/rgba in Components).
 *
 * Warum `colorSchemes`?
 * - In MUI v6 kann `createTheme({ cssVariables: { ... }, colorSchemes })` pro Scheme (light/dark)
 *   unterschiedliche Palette-Werte definieren.
 * - MUI erzeugt daraus CSS-Variablen (bei `cssVarPrefix: "template"` z.B. `--template-palette-baseShadow`).
 * - Wechsel des Color Schemes (data-mui-color-scheme) wechselt automatisch die CSS-Variablen.
 *
 * Wichtige Custom Keys (alle in `palette`)
 * - `baseShadow` (string): wird als CSS Variable konsumiert, um `theme.shadows[1]` scheme-abhängig zu machen.
 * - `boxShadow.card` (string): spezieller Shadow für eine Card-Komponente.
 * - `backgroundImage.signIn` (string): scheme-abhängiger Gradient (z.B. SignIn Background).
 * - `backgroundColorInverse` / `textColorInverse`: “inverse” Oberfläche/Text für Sonderfälle.
 * - `backgroundColor`: Alias für Legacy (entspricht `background`, kann später entfernt werden wenn ungenutzt).
 *
 * Ergebnis für Komponenten
 * - Normale Oberfläche:
 *   `backgroundColor: theme.palette.background.default`
 *   `color: theme.palette.text.primary`
 *
 * - Inverse Oberfläche:
 *   `backgroundColor: theme.palette.backgroundColorInverse?.default`
 *   `color: theme.palette.textColorInverse?.primary`
 *
 * - Gradient:
 *   `backgroundImage: theme.palette.backgroundImage?.signIn`
 *
 * - Shadows:
 *   `theme.shadows[1]` -> `var(--template-palette-baseShadow)` -> automatisch light/dark
 */

import { alpha, createTheme, Shadows } from '@mui/material/styles';

/** ---------------------------------------------
 * Type augmentation: Custom palette keys
 * ---------------------------------------------- */
declare module '@mui/material/styles' {
    interface Palette {
        backgroundColor?: { default: string; paper: string };

        backgroundColorInverse?: { default: string; paper: string };

        /** ✅ gradients via theme token (auto light/dark via colorSchemes) */
        backgroundImage?: { signIn: string };

        baseShadow: string;

        boxShadow?: {
            card: string;
        };

        headline?: {
            colorSecondary: string;
        };

        nav?: {
            bottom: {
                backgroundColor: string;
                text: string;
            };
        };

        textColorInverse?: { primary: string; secondary?: string };
    }

    interface PaletteOptions {
        backgroundColor?: { default?: string; paper?: string };

        backgroundColorInverse?: { default?: string; paper?: string };

        /** ✅ gradients via theme token (auto light/dark via colorSchemes) */
        backgroundImage?: { signIn?: string };

        baseShadow?: string;

        boxShadow?: {
            card?: string;
        };

        headline?: {
            colorSecondary: string;
        };

        nav?: {
            bottom: {
                backgroundColor: string;
                text: string;
            };
        };

        textColorInverse?: { primary?: string; secondary?: string };
    }
}

/** Base theme only used to reuse default shadows after index 1 */
const defaultTheme = createTheme();

/** ---------------- Primitives ---------------- */
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
    900: 'hsl(148, 100%, 11%)',
} as const;

export const gray = {
    50: 'hsl(0, 7%, 97%)',
    100: 'hsl(0, 7%, 92%)',
    200: 'hsl(0, 7%, 82%)',
    300: 'hsl(0, 7%, 72%)',
    400: 'hsl(0, 7%, 62%)',
    500: 'hsl(0, 7%, 52%)',
    600: 'hsl(0, 7%, 42%)',
    700: 'hsl(0, 7%, 32%)',
    800: 'hsl(0, 7%, 22%)',
    900: 'hsl(0, 7%, 12%)',
} as const;

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
} as const;

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
} as const;

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
} as const;

export const slate = {
    page: {
        hex: '#0B0F14',
        rgb: 'rgb(11, 15, 20)',
        rgba: 'rgba(11, 15, 20, 1)',
        hsl: 'hsl(213, 29%, 6%)',
    },
    surface1: {
        hex: '#121923',
        rgb: 'rgb(18, 25, 35)',
        rgba: 'rgba(18, 25, 35, 1)',
        hsl: 'hsl(215, 32%, 10%)',
    },
    surface2: {
        hex: '#171F2B',
        rgb: 'rgb(23, 31, 43)',
        rgba: 'rgba(23, 31, 43, 1)',
        hsl: 'hsl(216, 30%, 13%)',
    },
    surface3: {
        hex: '#1C2633',
        rgb: 'rgb(28, 38, 51)',
        rgba: 'rgba(28, 38, 51, 1)',
        hsl: 'hsl(215, 25%, 0%)',
    },
} as const;

/** ---------------- colorSchemes ---------------- */
export const colorSchemes = {
    light: {
        palette: {
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
            },

            background: {
                default: 'hsl(0, 0%, 100%)',
                paper: 'hsl(220, 35%, 97%)',
            },

            /** Alias (falls Komponenten das nutzen) */
            backgroundColor: {
                default: 'hsl(0, 0%, 100%)',
                paper: 'hsl(220, 35%, 97%)',
            },

            backgroundColorInverse: {
                default: gray[900],
                paper: slate.surface3.hsl,
            },

            /** ✅ theme-driven gradient */
            backgroundImage: {
                signIn: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            },

            /** Must be a string (so CSS variable can be consumed in theme.shadows[1]) */
            baseShadow:
                'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',

            boxShadow: {
                card: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
            },

            divider: alpha(gray[300], 0.4),

            error: {
                contrastText: brand[50],
                dark: red[500],
                light: red[200],
                main: red[300],
            },

            grey: { ...gray },

            headline: {
                colorSecondary: 'rgba(53,102,64, 1)',
            },

            info: {
                contrastText: gray[50],
                dark: brand[600],
                light: brand[100],
                main: brand[300],
            },

            nav: {
                bottom: {
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    text: 'rgba(33,29,29, 0.5)',
                },
            },

            primary: {
                contrastText: brand[50],
                dark: brand[700],
                light: brand[200],
                main: brand[400],
            },

            success: {
                contrastText: brand[50],
                dark: brand[800],
                light: brand[300],
                main: brand[400],
            },

            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
            },

            textColorInverse: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[100],
            },

            warning: {
                dark: orange[800],
                light: orange[300],
                main: orange[400],
            },
        },
    },

    dark: {
        palette: {
            action: {
                hover: alpha(gray[600], 0.2),
                selected: alpha(gray[600], 0.3),
            },

            background: {
                default: slate.page.hsl,
                paper: slate.surface1.hsl,
            },

            /** Alias (falls Komponenten das nutzen) */
            backgroundColor: {
                default: slate.page.hsl,
                paper: slate.surface3.hsl,
            },

            backgroundColorInverse: {
                default: slate.page.hsl,
                paper: slate.surface3.hsl,
            },

            /** ✅ theme-driven gradient */
            backgroundImage: {
                signIn: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            },

            /** ✅ must remain STRING (your shadows[1] depends on it) */
            baseShadow:
                'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',

            boxShadow: {
                card: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
            },

            divider: alpha(gray[700], 0.6),

            error: {
                contrastText: brand[50],
                dark: red[400],
                light: red[100],
                main: red[300],
            },

            grey: { ...gray },

            headline: {
                colorSecondary: 'rgba(255,255,255, 1)',
            },

            info: {
                contrastText: brand[300],
                dark: brand[900],
                light: brand[500],
                main: brand[700],
            },

            nav: {
                bottom: {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    text: 'rgba(0,0,0, 1)',
                },
            },

            primary: {
                contrastText: brand[50],
                dark: brand[700],
                light: brand[300],
                main: brand[400],
            },

            success: {
                contrastText: brand[50],
                dark: brand[700],
                light: brand[400],
                main: brand[500],
            },

            text: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: 'hsl(0, 0%, 100%)',
            },
            textColorInverse: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[700],
            },

            warning: {
                dark: orange[700],
                light: orange[400],
                main: orange[500],
            },
        },
    },
} as const;

/** shape (wie im Original) */
export const shape = {
    borderRadius: 8,
} as const;

/** ---------------------------------------------
 * shadows: CSS variable consumption
 * ---------------------------------------------- */
// @ts-expect-error MUI Shadows type does not allow CSS variables, but runtime supports it.
const defaultShadows: Shadows = [
    'none',
    'var(--template-palette-baseShadow)',
    ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;
