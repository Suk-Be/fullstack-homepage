import RouterLinkWrapper from '@/components/RouterLink';
import { Claim, Logo } from '@/components/TextElements';
import { testId } from '@/utils/testId';
import { Link as MuiLink } from '@mui/material';

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

export default LinkedLogo;
