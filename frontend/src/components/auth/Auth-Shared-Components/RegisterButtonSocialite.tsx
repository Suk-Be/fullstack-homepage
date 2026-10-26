// RegisterButtonSocialite.tsx
import { testId } from '@/utils/testId';
import { Button } from '@mui/material';
import { FC } from 'react';

interface RegisterButtonSocialiteProps {
    startIcon: React.ReactNode;
    text: string;
    testIdIdentifier: string;
    clickHandler: () => void;
}

const RegisterButtonSocialite: FC<RegisterButtonSocialiteProps> = ({
    startIcon,
    text,
    testIdIdentifier,
    clickHandler,
}) => {
    return (
        <Button
            fullWidth
            variant="outlined"
            onClick={clickHandler}
            startIcon={startIcon}
            sx={{
                /* DEFAULT */
                color: 'var(--template-palette-text-primary)',
                borderColor: 'var(--template-palette-divider)',
                backgroundColor: 'transparent',

                /* HOVER (light + dark) */
                '&:hover': {
                    color: 'var(--template-palette-text-primary)',
                    borderColor: 'var(--template-palette-text-primary)',
                    backgroundColor: 'var(--template-palette-action-hover)',
                },

                /* ACTIVE */
                '&:active': {
                    backgroundColor: 'var(--template-palette-action-selected)',
                },

                /* DISABLED */
                '&.Mui-disabled': {
                    opacity: 0.5,
                    color: 'var(--template-palette-text-primary)',
                    borderColor: 'var(--template-palette-divider)',
                    backgroundColor: 'transparent',
                },
            }}
            {...testId(testIdIdentifier)}
        >
            {text}
        </Button>
    );
};

export default RegisterButtonSocialite;
