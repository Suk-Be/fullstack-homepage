import { Box } from '@mui/material';
import OfferHP from '../components/offer';
import ProfileHP from '../components/profile';

const HomePage = () => {
    const layoutStyle = {
        display: 'flex',
        flexDirection: {
            xs: 'column',
            md: 'row',
        },
        justifyContent: 'center',
        alignItems: {
            xs: 'center',
            md: 'flex-start',
        },
    };
    return (
        <>
            <Box sx={layoutStyle}>
                <Box sx={{ width: { md: '33%' } }}>
                    <ProfileHP />
                </Box>
                <Box sx={{ width: { md: '67%' } }}>
                    <OfferHP />
                </Box>
            </Box>
        </>
    );
};

export default HomePage;
