import { testId } from '@/utils/testId';
import { Grid } from '@mui/material';
import LinkedLogo from './LinkedLogo';

const LoggedOutMenu = () => {
    return (
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
                padding: '0 1rem 0 2rem',
                justifyContent: 'row',
                alignItems: 'center',
            }}
            {...testId('logged-out-menu')}
        >
            <Grid sx={{ color: '#ffff' }}>
                <LinkedLogo />
            </Grid>
        </Grid>
    );
};

export default LoggedOutMenu;
