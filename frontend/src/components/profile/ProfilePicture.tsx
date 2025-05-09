import { Box } from '@mui/material';

const ProfilePic = ({ imgSrc }: { imgSrc: string }) => {
    const img = {
        maxWidth: '100%',
        height: 'auto',
        p: 0,
        m: 0,
        borderRadius: '1rem',
    };
    return <Box component="img" src={imgSrc} alt="Suk-Be Jang" sx={img} />;
};

export default ProfilePic;
