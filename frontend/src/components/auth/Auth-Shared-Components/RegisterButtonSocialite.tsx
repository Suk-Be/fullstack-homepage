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
                // Textfarbe + Border folgen dem Theme
                color: 'var(--template-palette-text-primary)',
                borderColor: 'var(--template-palette-divider)',

                '&:hover': {
                    borderColor: 'var(--template-palette-text-primary)',
                    backgroundColor: 'var(--template-palette-action-hover)',
                },

                '&.Mui-disabled': {
                    color: 'var(--template-palette-text-primary)',
                    borderColor: 'var(--template-palette-divider)',
                    opacity: 0.5,
                },
            }}
            {...testId(testIdIdentifier)}
        >
            {text}
        </Button>
    );
};

export default RegisterButtonSocialite;
