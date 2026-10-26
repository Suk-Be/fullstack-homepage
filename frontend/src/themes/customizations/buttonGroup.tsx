import { gray } from '@/themes/themePrimitives';
import { Components, Theme } from '@mui/material/styles';

const buttonGroupCustomizations: Components<Theme> = {
    MuiButtonGroup: {
        styleOverrides: {
            grouped: ({ theme }) => ({
                borderColor: gray[300],

                ...theme.applyStyles('dark', {
                    borderColor: gray[700],
                }),

                variants: [
                    {
                        props: { variant: 'contained' },
                        style: {
                            borderColor: gray[100],
                            ...theme.applyStyles('dark', {
                                borderColor: gray[600],
                            }),
                        },
                    },
                    {
                        props: { variant: 'outlined' },
                        style: {
                            borderColor: gray[300],
                            ...theme.applyStyles('dark', {
                                borderColor: gray[200],
                            }),
                        },
                    },
                    {
                        props: { variant: 'text' },
                        style: {
                            borderColor: gray[300],
                            ...theme.applyStyles('dark', {
                                borderColor: gray[600],
                            }),
                        },
                    },
                ],
            }),
        },
    },
};

export default buttonGroupCustomizations;
