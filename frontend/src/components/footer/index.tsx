import { BottomNavigation, Box } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';

const Footer = () => {
    const [value, setValue] = useState(0);

    return (
        <footer>
            <Box component="nav" sx={{ width: '100%', height: '50px' }}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    sx={{
                        height: '30px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'rgba(33,29,29, 0.5)',
                    }}
                >
                    <Link to="/impressum">Impressum</Link>
                </BottomNavigation>
            </Box>
        </footer>
    );
};

export default Footer;
