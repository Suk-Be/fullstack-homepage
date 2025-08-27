import RouterLinkWrapper from '@/components/RouterLink';
import { testId } from '@/utils/testId';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useState } from 'react';

const Footer = () => {
    const [value, setValue] = useState(0);

    return (
        <footer {...testId('footer')}>
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
                        component={RouterLinkWrapper}
                        href="/impressum"
                        label="Impressum"
                        style={{ color: 'rgba(33,29,29, 0.5)' }}
                        {...testId('link-impressum-page')}
                    />
                    <BottomNavigationAction
                        component={RouterLinkWrapper}
                        href="/datenschutz"
                        label="Datenschutz"
                        style={{ color: 'rgba(33,29,29, 0.5)' }}
                        {...testId('link-datenschutz-page')}
                    />
                </BottomNavigation>
            </Box>
        </footer>
    );
};

export default Footer;
