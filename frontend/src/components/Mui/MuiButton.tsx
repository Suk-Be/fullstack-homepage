import SendIcon from '@mui/icons-material/Send';
import { Button, IconButton, Stack } from '@mui/material';

// Ich habe den variants inkonsistente Farben gegeben
// check light danach check dark

const MuiButton = () => {
    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Stack spacing={2} direction="row">
                {/* buttons in mui have three variant versions */}
                <Button variant="text">Text</Button>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
            </Stack>

            <Stack spacing={2} direction="row">
                {/* the button becomes a link  */}
                <Button variant="text" href="https://sokdesign.de">
                    with href property the Button Compponent becomes an a tag
                </Button>
            </Stack>

            <Stack spacing={2} direction="row">
                {/* buttons in mui have six color variants */}
                <Button variant="contained" color="primary">
                    Primary
                </Button>
                <Button variant="contained" color="secondary">
                    Secondary
                </Button>
                <Button variant="contained" color="error">
                    Error
                </Button>
                <Button variant="contained" color="warning">
                    Warning
                </Button>
                <Button variant="contained" color="info">
                    Info
                </Button>
                <Button variant="contained" color="success">
                    Success
                </Button>
            </Stack>

            <Stack spacing={2} direction="row">
                {/* buttons in mui have six color variants */}
                <Button variant="text" color="primary">
                    Primary
                </Button>
                <Button variant="text" color="secondary">
                    Secondary
                </Button>
                <Button variant="text" color="error">
                    Error
                </Button>
                <Button variant="text" color="warning">
                    Warning
                </Button>
                <Button variant="text" color="info">
                    Info
                </Button>
                <Button variant="text" color="success">
                    Success
                </Button>
            </Stack>

            <Stack spacing={2} direction="row">
                {/* buttons in mui have six color variants */}
                <Button variant="outlined" color="primary">
                    Primary
                </Button>
                <Button variant="outlined" color="secondary">
                    Secondary
                </Button>
                <Button variant="outlined" color="error">
                    Error
                </Button>
                <Button variant="outlined" color="warning">
                    Warning
                </Button>
                <Button variant="outlined" color="info">
                    Info
                </Button>
                <Button variant="outlined" color="success">
                    Success
                </Button>
            </Stack>

            {/* button sizes: it is important to set display block.
            default display is flex and  it would affect the size of the buttons */}
            <Stack spacing={2} display="block" direction="row">
                <Button variant="contained" size="small">
                    Small
                </Button>
                <Button variant="contained" size="medium">
                    Medium
                </Button>
                <Button variant="contained" size="large">
                    Large
                </Button>
            </Stack>

            {/* Der default Wert des IconButton sollte nicht outlined sein, 
            color prop auf IconButton funktioniert nicht? */}
            <Stack spacing={2} direction="row">
                <Button variant="contained" startIcon={<SendIcon />}>
                    Send
                </Button>
                <Button variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
                {/* Buttons by default have a box shadow, it can be disabled */}
                <Button variant="contained" endIcon={<SendIcon />} disableElevation>
                    Send (disableElevation)
                </Button>
                {/* Buttons by default have a ripple effect, it can be disabled */}
                <Button variant="contained" endIcon={<SendIcon />} disableRipple>
                    Send (disableRipple)
                </Button>
                {/* onClick Event */}
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    disableRipple
                    onClick={() => alert('Clicked')}
                >
                    onClick alert()
                </Button>
                {/* IconButton: can have color and size properties like a Button be sure to add aria-label */}
                <IconButton aria-label="send" color="secondary" size="large">
                    <SendIcon />
                </IconButton>
            </Stack>
        </Stack>
    );
};

export { MuiButton };
