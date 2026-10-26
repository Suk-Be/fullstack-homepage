import { ColorMode } from '@/components/header/ColorMode';
import LinkedLogo from '@/components/header/LinkedLogo';
import { testId } from '@/utils/testId';
import { Grid } from '@mui/material';

const LoggedOutMenu = () => {
    return (
        <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{
                width: '100%',
                maxWidth: {
                    sm: 800,
                    md: 1024,
                    lg: 1600,
                    xl: 1920,
                },
                boxSizing: 'border-box',
                px: { xs: 2, sm: 3 }, // statt "padding: 0 1rem 0 2rem"
                alignItems: 'center',
            }}
            {...testId('logged-out-menu')}
        >
            <Grid>
                <LinkedLogo />
            </Grid>
            <Grid>
                <ColorMode />
            </Grid>
        </Grid>
    );
};

export default LoggedOutMenu;
