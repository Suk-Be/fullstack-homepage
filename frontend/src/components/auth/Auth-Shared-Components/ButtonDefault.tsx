import { testId } from '@/utils/testId';
import { Button } from '@mui/material';

interface BtnDefault {
    isSubmitting: boolean;
    btnName: string;
    testIdName: string;
}

export const ButtonDefault = ({ isSubmitting, btnName, testIdName }: BtnDefault) => {
    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            {...testId(testIdName)}
        >
            {isSubmitting ? 'Wird gesendet...' : btnName}
        </Button>
    );
};
