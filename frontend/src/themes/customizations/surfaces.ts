import { backgroundDark, gray } from '@/themes/themePrimitives';
import { alpha, Components, Theme } from '@mui/material/styles';

const surfacesCustomizations: Components<Theme> = {
    MuiAccordion: {
        defaultProps: {
            elevation: 0,
            disableGutters: true,
        },
        styleOverrides: {
            root: ({ theme }) => ({
                padding: 4,
                overflow: 'clip',
                backgroundColor: 'transparent',
                border: '1px solid',
                borderColor: theme.palette.divider,
                ':before': {
                    backgroundColor: 'transparent',
                },
                '&:not(:last-of-type)': {
                    borderBottom: 'none',
                },
                '&:first-of-type': {
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                },
                '&:last-of-type': {
                    borderBottomLeftRadius: theme.shape.borderRadius,
                    borderBottomRightRadius: theme.shape.borderRadius,
                },
                ...theme.applyStyles('dark', {
                    borderColor: backgroundDark.paperAccent,
                }),
            }),
        },
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: ({ theme }) => ({
                border: 'none',
                borderRadius: 8,
                '&:hover': { backgroundColor: gray[50] },
                '&:focus-visible': { backgroundColor: 'transparent' },
                ...theme.applyStyles('dark', {
                    '&:hover': { backgroundColor: backgroundDark.paperAccent },
                }),
            }),
        },
    },
    MuiAccordionDetails: {
        styleOverrides: {
            root: { mb: 20, border: 'none' },
        },
    },
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
    },
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: 16,
                gap: 16,
                transition: 'all 100ms ease',
                borderRadius: theme.shape.borderRadius,
                boxShadow: 'none',
                backgroundColor: gray[50],

                ...theme.applyStyles('dark', {
                    backgroundColor: alpha(gray[900], 0.4),
                }),
            }),
        },
        variants: [
            {
                props: { variant: 'outlined' },
                style: ({ theme }) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    backgroundColor: 'hsl(0, 0%, 100%)',

                    ...theme.applyStyles('dark', {
                        border: `1px solid ${backgroundDark.paperAccent}`,
                        backgroundColor: alpha(gray[900], 0.4),
                    }),
                }),
            },
        ],
    },
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 0,
                '&:last-child': { paddingBottom: 0 },
            },
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            root: {
                padding: 0,
            },
        },
    },
    MuiCardActions: {
        styleOverrides: {
            root: {
                padding: 0,
            },
        },
    },
};

export default surfacesCustomizations;
