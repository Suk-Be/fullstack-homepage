import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    SxProps,
    TextField,
    Theme,
} from '@mui/material';

type PasswordFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: React.ReactNode;
    show: boolean;
    onToggleShow: () => void;
    autoComplete?: string;
    testId?: Record<string, any>;
    sx?: SxProps<Theme>;
};

export function LabeledPasswordField({
    id,
    name,
    label,
    value,
    onChange,
    error,
    helperText,
    show,
    onToggleShow,
    autoComplete,
    testId,
    sx,
}: PasswordFieldProps) {
    return (
        <FormControl sx={sx}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
                id={id}
                name={name}
                placeholder="••••••"
                type={show ? 'text' : 'password'}
                fullWidth
                required
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={helperText}
                autoComplete={autoComplete}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onToggleShow}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                >
                                    {show ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                {...(testId ?? {})}
            />
        </FormControl>
    );
}
