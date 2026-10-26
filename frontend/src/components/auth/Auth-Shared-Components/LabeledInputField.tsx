import { FormControl, FormLabel, TextField, type SxProps, type Theme } from '@mui/material';

type LabeledTextFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    required?: boolean;
    disabled?: boolean;

    error?: boolean;
    helperText?: React.ReactNode;
    color?: 'primary' | 'error';

    testId?: Record<string, any>;
    rootTestId?: Record<string, any>;
    sx?: SxProps<Theme>;
};

export function LabeledTextField({
    id,
    name,
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    autoComplete,
    autoFocus,
    required,
    disabled,
    error,
    helperText,
    color,
    testId,
    rootTestId,
    sx,
}: LabeledTextFieldProps) {
    return (
        <FormControl sx={{ width: 1, ...sx }} {...(rootTestId ?? {})}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                required={required}
                disabled={disabled}
                value={value}
                onChange={onChange}
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={helperText}
                color={color}
                {...(testId ?? {})}
            />
        </FormControl>
    );
}
