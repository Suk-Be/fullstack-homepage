import { Box } from '@mui/material';
import { RegisterForm } from '../components/RegisterForm';

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
