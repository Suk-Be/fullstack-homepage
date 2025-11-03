import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    message?: string;
    height?: string;
    mt?: number;
    px?: number;
    size?: number;
    textColor?: string;
}

const Loading = ({
    message = 'Loading...',
    height = '100vh',
    mt = 2,
    px = 2,
    size = 40,
    textColor = 'text.secondary',
}: LoadingProps) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={height}
            textAlign="center"
            px={px}
        >
            <CircularProgress color="primary" size={size} />
            <Typography variant="body1" mt={mt} color={textColor}>
                {message}
            </Typography>
        </Box>
    );
};

export default Loading;
