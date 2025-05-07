import { Box } from '@mui/material';

const ProfilePic = () => {
    const img = {
        maxWidth: '100%',
        height: 'auto',
        p: 0,
        m: 0,
        borderRadius: '1rem',
    };
    return (
        <Box component="img" src="https://sokdesign.de/images/Sok.jpg" alt="Suk-Be Jang" sx={img} />
    );
};

export default ProfilePic;
