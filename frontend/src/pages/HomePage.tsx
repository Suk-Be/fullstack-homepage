import { Box } from '@mui/material';
import ToggleSignIn from '../components/auth';
import OfferHP from '../components/offer';
import ProfileHP from '../components/profile';
import { HPProps } from '../data/HomePage';

const HomePage = () => {
    const profile = HPProps.data.filter((item) => item.type === 'profile')[0];
    const offer = HPProps.data.filter((item) => item.type === 'offer');
    const teaser = HPProps.data.filter((item) => item.type === 'teaser')[0];

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
                    {/* @ts-ignore*/}
                    <ProfileHP profile={profile} />
                </Box>
                <Box sx={{ width: { md: '67%' } }}>
                    {/* @ts-ignore*/}
                    <OfferHP offer={offer} teaser={teaser} />
                    <ToggleSignIn />
                </Box>
            </Box>
        </>
    );
};

export default HomePage;
