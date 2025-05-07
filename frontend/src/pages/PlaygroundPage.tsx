import { Box } from '@mui/material';
import RatingAndLoginTest from '../components/LoginTest';
import SignUp from '../components/SignUp';

const PlaygroundPage = () => {
    return (
        <Box sx={{ padding: '7rem 0rem' }}>
            <SignUp />
            <RatingAndLoginTest />
        </Box>
    );
};

export default PlaygroundPage;
