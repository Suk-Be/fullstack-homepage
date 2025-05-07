import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { PropsWithChildren } from 'react';

const SimpleContainer = ({ children }: PropsWithChildren) => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>{children}</Box>
        </Container>
    );
};

export default SimpleContainer;
