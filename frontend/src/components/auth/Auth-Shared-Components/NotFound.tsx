import RouterLinkWrapper from '@/components/RouterLink';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { Box, Link as MuiLink, Typography } from '@mui/material';

const NotFound = ({ errorMessage = '' }: { errorMessage?: string }) => {
    const Headline = () => {
        if (import.meta.env.MODE === 'production') {
            return (
                <Typography variant="h5" gutterBottom>
                    Seite nicht gefunden (404)
                </Typography>
            );
        }
        // development or test
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Seite nicht gefunden (404)
                </Typography>
                <code>{errorMessage}</code>
                <br />
            </>
        );
    };

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
            <NotificationImportantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />

            <Headline />
            <Typography variant="body1" color="text.secondary" mb={3}>
                Hoppla! Es sieht so aus, als hätten Sie eine Seite erreicht, die nicht existiert.
                Das kann passieren, wenn sich ein Link geändert hat, die Seite verschoben wurde oder
                Sie sich vielleicht vertippt haben.
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
                Keine Sorge, Sie sind nicht verloren!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
                Vielleicht möchten Sie zur Startseite zurückkehren? Von dort aus können Sie ganz
                einfach navigieren und finden, was Sie suchen.
            </Typography>
            <MuiLink component={RouterLinkWrapper} href="/">
                Zur Startseite
            </MuiLink>
        </Box>
    );
};

export default NotFound;
