/**
 * themePrimitives.ts (MUI v6 + CSS Variables)
 *
 * Zweck
 * - Zentrale Ablage der Farb-/Style-Tokens für Light/Dark (`colorSchemes`).
 * - Komponenten sollen möglichst nur Theme-Werte lesen (keine hardcoded HSL/rgba in Components).
 *
 * Warum `colorSchemes`?
 * - In MUI v6 kann `createTheme({ cssVariables: { ... }, colorSchemes })` siehe AppTheme.tsx eine Farbkonfiguration übergeben werden
 * - MUI erzeugt daraus CSS-Variablen (bei `cssVarPrefix: "template"` z.B. `--template-palette-yourPorperty`) anwendbare selectoren.
 *
 * In der colorScheme Konfiguration finden sich dark und light definition
 */

import { alpha, createTheme, Shadows } from '@mui/material/styles';

/** ---------------------------------------------
 * Type augmentation: Custom palette keys
 * ---------------------------------------------- */
declare module '@mui/material/styles' {
    interface Palette {
        /** ✅ gradients via theme token (auto light/dark via colorSchemes) */
        // backgroundImage?: { signIn: string };

        baseShadow: string;

        boxShadow?: {
            card: string;
        };

        headline?: {
            colorSecondary: string;
        };

        textColorInverse?: { primary: string; secondary?: string };
    }

    interface PaletteOptions {
        baseShadow?: string;

        boxShadow?: {
            card?: string;
        };

        headline?: {
            colorSecondary: string;
        };

        textColorInverse?: { primary?: string; secondary?: string };
    }
}

/** Base theme only used to reuse default shadows after index 1 */
const defaultTheme = createTheme();

/** ---------------- Primitives ---------------- */
export const brand = {
    50: 'hsl(148, 100%, 96%)', // needed
    100: 'hsl(148, 100%, 91%)', // needed
    200: 'hsl(148, 100%, 81%)', // needed
    300: 'hsl(148, 100%, 71%)', // needed
    logo: 'hsl(148, 100%, 61%)', // needed
    500: 'hsl(148, 100%, 51%)', // needed
    600: 'hsl(148, 100%, 41%)', // needed
    logoDarkAccent: 'hsl(148, 100%, 31%)', // needed
    800: 'hsl(148, 100%, 21%)', // needed
    900: 'hsl(148, 100%, 11%)', // needed
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
    1000: alpha('hsl(0, 6%, 12%)', 0.5),
    1100: 'hsl(0, 6%, 12%)',
    1200: 'hsl(213, 29%, 6%)',
    1300: 'hsl(215, 32%, 10%)',
    1400: 'hsl(215, 25%, 0%)',
} as const;

export const white = {
    50: 'hsl(0, 0%, 100%)',
    100: 'hsl(220, 35%, 97%)',
} as const;

export const red = {
    200: 'hsl(328, 100%, 81%)',
    300: 'hsl(328, 100%, 61%)',
} as const;

export const typography = {
    brand: brand.logo,
    brandDark: gray[900],
    brandDarkTransparent: alpha(gray[900], 0.5),
    flow: gray[1100],
    hl: gray[800],
} as const;

export const background = {
    body: white[50],
    paper: white[100],
    paperAccent: gray[900],
} as const;

export const backgroundDark = {
    body: gray[1200],
    paper: gray[1300],
    paperAccent: gray[1400],
} as const;

export const error = {
    light: red[200],
    dark: red[300],
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
                default: background.body,
                paper: background.paper,
                paperAccent: background.paperAccent,
                paperGradient:
                    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            },

            baseShadow:
                'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',

            boxShadow: {
                card: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
            },

            divider: alpha(gray[300], 0.4),

            error: {
                main: red[300],
            },

            grey: { ...gray },

            headline: {
                colorSecondary: brand.logoDarkAccent,
            },

            primary: {
                // contrastText: brand[50],
                light: brand[200],
                main: brand.logo,
            },

            text: {
                primary: gray[800],
                secondary: gray[600],
            },

            textColorInverse: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[100],
                toggleTheme: gray[500],
                loggedInMenu: gray[900],
                loggedInMenuColorTheme: 'hsl(0, 0%, 30%)',
            },
        },
    },

    dark: {
        palette: {
            action: {
                hover: alpha(gray[600], 0.12),
                selected: alpha(gray[600], 0.3),
            },

            background: {
                default: backgroundDark.body,
                paper: backgroundDark.paper,
                paperAccent: backgroundDark.paperAccent,
                paperGradient:
                    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            },

            baseShadow:
                'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',

            boxShadow: {
                card: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
            },

            divider: backgroundDark.paperAccent,

            error: {
                main: red[200],
            },

            grey: { ...gray },

            headline: {
                colorSecondary: 'rgba(255,255,255, 1)',
            },

            primary: {
                dark: brand.logoDarkAccent,
                light: brand[300],
                main: brand.logo,
            },

            text: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: 'hsl(0, 0%, 100%)',
            },

            textColorInverse: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[700],
                toggleTheme: gray[800],
                loggedInMenu: 'hsl(0, 0%, 100%)',
                loggedInMenuColorTheme: 'hsl(0, 0%, 70%)',
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
