import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import type { MouseEventHandler } from 'react';

interface VisibilityIcon {
    togglePassword: MouseEventHandler<HTMLButtonElement>;
    showPassword: boolean;
}

export const VisibilityIcon = ({ togglePassword, showPassword }: VisibilityIcon) => {
    return (
        <InputAdornment position="end">
            <IconButton
                onClick={togglePassword}
                edge="end"
                aria-label="Toggle password visibility"
                // sx={{
                //     /* DEFAULT */
                //     color: 'var(--template-palette-text-primary)',
                //     borderColor: 'var(--template-palette-divider)',
                //     backgroundColor: 'transparent',

                //     /* HOVER (light + dark) */
                //     '&:hover': {
                //         color: 'var(--template-palette-text-primary)',
                //         borderColor: 'var(--template-palette-text-primary)',
                //         backgroundColor: 'var(--template-palette-action-hover)',
                //     },

                //     /* ACTIVE */
                //     '&:active': {
                //         backgroundColor: 'var(--template-palette-action-selected)',
                //     },

                //     /* DISABLED */
                //     '&.Mui-disabled': {
                //         opacity: 0.5,
                //         color: 'var(--template-palette-text-primary)',
                //         borderColor: 'var(--template-palette-divider)',
                //         backgroundColor: 'transparent',
                //     },
                // }}
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );
};
