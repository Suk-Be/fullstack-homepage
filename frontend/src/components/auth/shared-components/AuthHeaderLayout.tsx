import { Grid, Link, Typography } from '@mui/material';
import { testId } from '../../../utils/testId';
import { HeadlineSignInUp } from '../../TextElements';

type AuthHeaderLayoutProps = {
    title: string;
    onToggleAuth: () => void;
    textBeforeLink?: string;
    linkLabel?: string;
    testIds: {
        title: string;
        link: string;
    };
};

const AuthHeaderLayout = ({
    title,
    onToggleAuth,
    textBeforeLink = 'Verfügen Sie über ein Konto?',
    linkLabel,
    testIds,
}: AuthHeaderLayoutProps) => (
    <Grid
        container
        spacing={2}
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // vertically center the grid items
        }}
    >
        <Grid>
            <HeadlineSignInUp {...testId(testIds.title)}>{title}</HeadlineSignInUp>
        </Grid>

        <Grid>
            <Typography sx={{ fontSize: '0.875rem' }}>
                {textBeforeLink}{' '}
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleAuth();
                    }}
                    variant="body2"
                    sx={{ fontSize: '0.875rem' }}
                    {...testId(testIds.link)}
                >
                    {linkLabel}
                </Link>
            </Typography>
        </Grid>
    </Grid>
);

export default AuthHeaderLayout;
