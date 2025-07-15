import { Avatar, Button, Grid, Menu, MenuItem, Link as MuiLink } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { logout } from '../../store/loginSlice';
import { testId } from '../../utils/testId';
import RouterLinkWrapper from '../RouterLink';
import { Claim, Logo } from '../TextElements';
import requestLogout from './requestLogout';

export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const dispatch: AppDispatch = useDispatch();
    const handleLogout = async () => {
        const logState = false;
        const result = await requestLogout(logState);

        if (result.success) {
            dispatch(logout());
        }

        setAnchorEl(null);
    };

    const LinkedLogo = () => {
        return (
            <MuiLink
                component={RouterLinkWrapper}
                href="/"
                sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                }}
                {...testId('link-home-page')}
            >
                <Logo
                    fontSize="1rem"
                    lineHeight="0.5"
                    color="rgba(33,29,29, 1)"
                    marginTop="1rem"
                    variant="h5"
                    component="h5"
                />
                <Claim fontSize="0.8rem" marginBottom="0rem" color="rgba(33,29,29, 1)">
                    (Web Developer)
                </Claim>
            </MuiLink>
        );
    };

    // todo
    // https://mui.com/material-ui/react-avatar/#letter-avatars
    // Letter Avatars

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
                        id="avatar-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        {...testId('button-open-menu')}
                    >
                        <Avatar alt="Hulk AI" src="https://sokdesign.de/images/avatar.jpg" />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            list: {
                                'aria-labelledby': 'basic-button',
                                sx: {
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    gap: 1,
                                    '& li a': {
                                        color: (theme) => theme.palette.grey[600],
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'none', // prevent underline on hover
                                        },
                                    },
                                    '& li:last-child': {
                                        marginTop: '1rem',
                                        fontWeight: 'bold',
                                    },
                                },
                            },
                            paper: {
                                sx: {
                                    minWidth: {
                                        xs: 'calc(100vw - 2.5rem)',
                                        sm: '50vw',
                                        md: '400px',
                                    },
                                },
                            },
                        }}
                        {...testId('button-close-menu')}
                        disableScrollLock
                    >
                        <MenuItem onClick={handleClose}>
                            <MuiLink component={RouterLinkWrapper} href="/playground">
                                PlaygroundPage
                            </MuiLink>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <MuiLink component={RouterLinkWrapper} href="/template-engine">
                                Template Engine
                            </MuiLink>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <MuiLink component={RouterLinkWrapper} href="/test-another-project">
                                Test Protected Page
                            </MuiLink>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <MuiLink component={RouterLinkWrapper} href="/">
                                Logout
                            </MuiLink>
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </>
    );
}
