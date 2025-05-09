import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';

const Footer = () => {
    const [value, setValue] = useState(0);

    return (
        <footer
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <Box
                component="nav"
                sx={{
                    width: '100%',
                    height: {
                        xs: '30px',
                        md: '50px',
                    },
                }}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    sx={{
                        height: {
                            xs: '30px',
                            md: '50px',
                        },
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'rgba(33,29,29, 0.5)',
                        background: 'rgba(255, 255, 255, 0.75)',
                    }}
                >
                    <BottomNavigationAction
                        component={Link}
                        to="/impressum"
                        label="Impressum"
                        style={{ color: 'rgba(33,29,29, 0.5)' }}
                    />
                </BottomNavigation>
            </Box>
        </footer>
    );
};

export default Footer;
