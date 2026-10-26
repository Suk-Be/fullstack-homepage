import { Button, ButtonGroup, Grid, Stack } from '@mui/material';

const MuiButtonGroup = () => {
    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            {/* ButtonGroup for one look for group functionality */}
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid
                    size={{ xs: 6, md: 4 }}
                    sx={{
                        mb: 4,
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <ButtonGroup
                            variant="contained"
                            aria-label="alignment button group"
                            sx={{ boxShadow: 'none' }}
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                        <ButtonGroup
                            variant="contained"
                            orientation="vertical"
                            aria-label="alignment button group"
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 6, md: 4 }}
                    sx={{
                        mb: 4,
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <ButtonGroup variant="outlined" aria-label="alignment button group">
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>

                        <ButtonGroup
                            variant="outlined"
                            orientation="vertical"
                            aria-label="alignment button group"
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 6, md: 4 }}
                    sx={{
                        mb: 4,
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <ButtonGroup variant="text" aria-label="alignment button group">
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>

                        <ButtonGroup
                            variant="text"
                            orientation="vertical"
                            aria-label="alignment button group"
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 6, md: 4 }}
                    sx={{
                        mb: 4,
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <ButtonGroup
                            variant="contained"
                            size="large"
                            color="secondary"
                            aria-label="alignment button group"
                            sx={{ boxShadow: 'none' }}
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>

                        <ButtonGroup
                            variant="contained"
                            orientation="vertical"
                            size="large"
                            color="secondary"
                            sx={{ boxShadow: 'none' }}
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 6, md: 4 }}
                    sx={{
                        mb: 4,
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <ButtonGroup
                            variant="contained"
                            size="small"
                            color="secondary"
                            sx={{ boxShadow: 'none' }}
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>

                        <ButtonGroup
                            variant="contained"
                            orientation="vertical"
                            size="small"
                            color="secondary"
                        >
                            <Button>Left</Button>
                            <Button>Center</Button>
                            <Button>Right</Button>
                        </ButtonGroup>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
};

export { MuiButtonGroup };
