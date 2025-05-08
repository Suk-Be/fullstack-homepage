import { Avatar, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Claim, Logo } from '../TextElements';

interface BasicMenuProps {
    changeLoginStatus?: () => void;
}

export default function BasicMenu({ changeLoginStatus }: BasicMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        if (changeLoginStatus) {
            changeLoginStatus();
        }
        setAnchorEl(null);
    };

    const isUrlPlayground = window.location.href.indexOf('playground') !== -1 ? true : false;

    console.log('isUrlPlayground', isUrlPlayground);

    const LinkedLogo = () => {
        return (
            <Link
                href="/"
                sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                }}
            >
                <Logo fontSize="1rem" lineHeight="0.5" color="rgba(33,29,29, 1)" marginTop="1rem" />
                <Claim fontSize="0.8rem" marginBottom="0rem" color="rgba(33,29,29, 1)">
                    (Web Developer)
                </Claim>
            </Link>
        );
    };

    // const setAvatar = () => {
    //     return isUrlPlayground ? (
    //         <AccountCircleTwoToneIcon sx={{ color: '#000', fontSize: '2rem' }} />
    //     ) : (
    //         <AccountCircleTwoToneIcon sx={{ color: '#fff', fontSize: '2rem' }} />
    //     );
    // };

    return (
        <>
            <Grid
                container
                spacing={2}
                sx={{
                    width: {
                        xs: '500px',
                        sm: '800px',
                        md: '1024px',
                        lg: '1600px',
                        xl: '1920px',
                    },
                    padding: '0 2rem 0 1rem',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Grid sx={{ color: '#ffff' }}>
                    <LinkedLogo />
                </Grid>
                <Grid sx={{ color: '#ffff' }}>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <Avatar alt="Hulk AI" src="https://sokdesign.de/images/avatar.jpg" />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        sx={{ maxWidth: 'calc(100% - 4rem)' }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link href="/playground">PlaygroundPage</Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Link href="/">Logout</Link>
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </>
    );
}
