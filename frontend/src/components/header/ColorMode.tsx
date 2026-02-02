import { useColorScheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

type ColorModeValue = 'system' | 'light' | 'dark';
type ColorThemeProps = {
    color: string;
};

export const ColorMode = ({
    color = 'var(--template-palette-textColorInverse-toggleTheme)',
}: ColorThemeProps) => {
    const { mode, setMode } = useColorScheme();
    if (!mode) return null;

    const colorTheme = color;
    const baseFontSize = '0.875rem';
    const responsiveFontSize = {
        xs: baseFontSize,
        md: `calc(${baseFontSize} * 0.9)`,
        lg: baseFontSize,
    } as const;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target.value as ColorModeValue);
    };

    return (
        <FormControl
            component="fieldset"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.5,

                '& .MuiFormLabel-root': {
                    color: colorTheme,
                    fontSize: responsiveFontSize,
                    lineHeight: 1,
                    m: 0,

                    '&.Mui-focused': { color: colorTheme },
                },

                '& .MuiFormControlLabel-label': {
                    color: colorTheme,
                    fontSize: responsiveFontSize,
                    lineHeight: 1,
                },
            }}
        >
            <FormLabel>Theme</FormLabel>

            <RadioGroup
                row
                value={mode}
                onChange={handleChange}
                sx={{ m: 0, alignItems: 'center', gap: 1 }}
            >
                {['system', 'light', 'dark'].map((value) => (
                    <FormControlLabel
                        key={value}
                        value={value}
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        control={
                            <Radio
                                sx={{
                                    p: 0.5,
                                    color: colorTheme,
                                    '&.Mui-checked': { color: colorTheme },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: { xs: '1.1rem', md: '1rem', lg: '1.1rem' },
                                    },
                                }}
                            />
                        }
                        sx={{ m: 0, gap: 0.5 }}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};
