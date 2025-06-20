import { Box } from '@mui/material';
import LoginTest from '../components/LoginTest';
import ToggleSignIn from '../components/auth/index';

const PlaygroundPage = () => {
    return (
        <Box sx={{ padding: '7rem 0rem' }}>
            <LoginTest />
            <ToggleSignIn />
        </Box>
    );
};

export default PlaygroundPage;
