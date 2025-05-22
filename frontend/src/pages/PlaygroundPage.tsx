import { Box } from '@mui/material';
import LoginTest from '../components/LoginTest';
import SignUp from '../components/auth/SignUp';

const PlaygroundPage = () => {
    return (
        <Box sx={{ padding: '7rem 0rem' }}>
            <LoginTest />
            <SignUp />
        </Box>
    );
};

export default PlaygroundPage;
