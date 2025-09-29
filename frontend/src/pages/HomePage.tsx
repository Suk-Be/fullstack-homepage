import ToggleTeaser from '@/components/auth';
import OfferHP from '@/components/offer';
import ProfileHP from '@/components/profile';
import { HPProps } from '@/data/HomePage';
import { Box } from '@mui/material';

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
                <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                    {/* @ts-expect-error --- */}
                    <ProfileHP profile={profile} />
                </Box>
                <Box sx={{ width: { xs: '100%', md: '67%' } }}>
                    {/* @ts-expect-error  --- */}
                    <OfferHP offer={offer} teaser={teaser} />
                    <ToggleTeaser />
                </Box>
            </Box>
        </>
    );
};

export default HomePage;
