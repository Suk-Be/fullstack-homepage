import { RegisterForm } from '@/components/RegisterForm';
import { Box } from '@mui/material';

const PlaygroundPage = () => {
    return (
        <Box sx={{ padding: '7rem 0rem' }}>
            <RegisterForm />
            {/* <LoginTest />
            <ToggleSignIn /> */}
        </Box>
    );
};

export default PlaygroundPage;
