import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react';

const MuiTextField = () => {
    const [visible, setVisibility] = useState(false);
    const [value, setValue] = useState('');

    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Stack direction="row" spacing={2}>
                <TextField label="default variant" />

                <TextField label="outlined" variant="outlined" />
                <TextField label="filled" variant="filled" />
                <TextField label="standard" variant="standard" />
            </Stack>

            <Stack direction="row" spacing={2}>
                {/** Die label color sieht rot aus! */}
                {/** Es gibt nur small und medium, medium ist default. Small sieht aus wie medium */}
                <TextField label="small secondary color" size="small" color="secondary" />
            </Stack>

            <Stack direction="row" spacing={2}>
                {/** required add asterix */}
                <TextField label="email" required />
                {/** helperText adds text under textfield */}
                <TextField label="email" required helperText="is needed to identify you" />
                {/** type adds html type functionality */}
                <TextField
                    label="password"
                    required
                    type="password"
                    helperText="do not show anyone else"
                />
                {/** disabled greys out text and disables input field */}
                <TextField
                    label="password"
                    disabled
                    type="password"
                    helperText="do not show anyone else"
                />
                {/** inputProps */}
                <TextField
                    label="read only"
                    slotProps={{
                        htmlInput: {
                            readOnly: true,
                        },
                    }}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                {/** required add asterix */}
                <TextField
                    label="amount"
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        },
                    }}
                    type="number"
                />
                {/** helperText adds text under textfield */}
                <TextField
                    label="weight"
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        },
                    }}
                    type="number"
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                {/** in SignUp und SignIn Componente diese neue Version anpassen */}
                <TextField
                    label="visibility"
                    type={visible ? 'text' : 'password'}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setVisibility((v) => !v)}
                                        edge="end"
                                        aria-label={visible ? 'Hide password' : 'Show password'}
                                    >
                                        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                {/** error prop */}
                <TextField
                    label="email"
                    required
                    type="email"
                    onChange={(e) => setValue(e.target.value)}
                    error={!value}
                    helperText={!value ? 'Required' : 'Do not share your password with anyone'}
                />
            </Stack>
        </Stack>
    );
};

export { MuiTextField };
