import { gray, red } from '@/themes/themePrimitives';
import { alpha, Components, Theme } from '@mui/material/styles';

const feedbackCustomizations: Components<Theme> = {
    MuiAlert: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: 10,
                backgroundColor: red[300],
                color: theme.palette.text.primary,
                border: `1px solid ${alpha(red[300], 0.5)}`,
                '& .MuiAlert-icon': {
                    color: red[300],
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: `${alpha(red[200], 0.5)}`,
                    border: `1px solid ${alpha(red[300], 0.5)}`,
                }),
            }),
        },
    },
    MuiDialog: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiDialog-paper': {
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                },
            }),
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 8,
                borderRadius: 8,
                backgroundColor: gray[200],
                ...theme.applyStyles('dark', {
                    backgroundColor: gray[800],
                }),
            }),
        },
    },
};

export default feedbackCustomizations;
