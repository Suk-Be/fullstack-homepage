import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

const ListNumber = ({ children }: PropsWithChildren) => {
    return (
        <Box
            sx={{
                borderRadius: '1rem',
                background: 'rgba(33,29,29, 1)',
                color: 'rgba(255,255,255, 1)',
                width: '1.5rem',
                flexGrow: 0,
                marginLeft: '0.25rem',
                fontWeight: 800,
            }}
        >
            {children}
        </Box>
    );
};

export default ListNumber;
