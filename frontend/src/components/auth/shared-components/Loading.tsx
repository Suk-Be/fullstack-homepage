import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" mt={2} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;