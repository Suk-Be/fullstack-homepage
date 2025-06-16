import { Button } from '@mui/material';
import { FC } from 'react';
import { testId } from '../../../utils/testId';

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
            {...testId(testIdIdentifier)}
        >
            {text}
        </Button>
    );
};

export default RegisterButtonSocialite;
