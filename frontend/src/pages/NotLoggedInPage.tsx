import RouterLinkWrapper from '@/components/RouterLink';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Link as MuiLink, Typography } from '@mui/material';

const NotLoggedInPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
    >
      <LockOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Willkommen zurück!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Um diese Seite nutzen zu können, melden Sie sich bitte kurz auf der Startseite an.
      </Typography>
      <MuiLink component={RouterLinkWrapper} href="/">
        Zur Startseite
      </MuiLink>
    </Box>
  );
}

export default NotLoggedInPage