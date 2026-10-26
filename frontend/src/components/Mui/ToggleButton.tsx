import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

const MuiToggleButton = () => {
    const [formats, setFormats] = useState<string[]>([]);
    console.log({ formats });
    const handleFormatChange = (
        _event: React.MouseEvent<HTMLElement>,
        updatedFormats: string[],
    ) => {
        setFormats(updatedFormats);
    };
    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Stack direction="row" spacing={2}>
                <Stack spacing={1}>
                    <ToggleButtonGroup
                        size="small"
                        color="warning"
                        aria-label="text formatting"
                        value={formats}
                        onChange={handleFormatChange}
                    >
                        <ToggleButton value="bold" aria-label="bold">
                            <FormatBoldIcon />
                        </ToggleButton>
                        <ToggleButton value="italic" aria-label="italic">
                            <FormatItalicIcon />
                        </ToggleButton>
                        <ToggleButton value="underlined" aria-label="underlined">
                            <FormatUnderlinedIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <Stack spacing={1}>
                    <ToggleButtonGroup
                        size="large"
                        color="secondary"
                        aria-label="text formatting"
                        value={formats}
                        onChange={handleFormatChange}
                    >
                        <ToggleButton value="bold" aria-label="bold">
                            <FormatBoldIcon />
                        </ToggleButton>
                        <ToggleButton value="italic" aria-label="italic">
                            <FormatItalicIcon />
                        </ToggleButton>
                        <ToggleButton value="underlined" aria-label="underlined">
                            <FormatUnderlinedIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                {/* ToggleButtonGroup properties color and size do not apply */}
            </Stack>
        </Stack>
    );
};

export { MuiToggleButton };
