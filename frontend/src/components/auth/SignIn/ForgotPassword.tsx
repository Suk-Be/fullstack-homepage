import { Box, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { FormEvent, useState } from 'react';
import setResponseErrorMessage from '../../../utils/auth/setResponseErrorMessage';
import requestForgotPassword from './requestForgotPassword';
import { validateForgotPasswordInput } from './validateForgotInput';

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

type FieldError = {
    hasError: boolean;
    message: string;
};

type InputErrorState = {
    email: FieldError;
};

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    // inputs
    const [email, setEmail] = useState('');
    // frontend input validation errors
    const [fieldErrors, setFieldErrors] = useState<InputErrorState>({
        email: { hasError: false, message: '' },
    });
    // frontend api response validation errors
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    // disable submit button
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // This handleSubmit will now be called by the Dialog's form directly
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        // reset backend validation
        setErrors({});
        setSuccessMessage(null);

        const { isValid, emailError, emailErrorMessage } = validateForgotPasswordInput(email);

        setFieldErrors({
            email: { hasError: emailError, message: emailErrorMessage },
        });

        // do not submit if frontend validation fails
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        const result = await requestForgotPassword(email);

        if (result.success) {
            console.log('forgot password: ', result);
            setEmail('');
            setSuccessMessage(
                result.message ||
                    'Passwort-Reset-Link gesendet. Bitte überprüfen Sie Ihre E-Mails.',
            );
            setTimeout(() => handleClose(), 1000);
        } else {
            // response validation
            const backendRawErrors = result.errors || {};

            const emailBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'email',
                'Ein unbekannter Fehler bei der E-Mail.',
            );

            setFieldErrors({
                email: {
                    hasError: !!emailBackendErrorMessage, // Set hasError based on whether a message exists
                    message: emailBackendErrorMessage,
                },
            });
        }
        setIsSubmitting(false);
    };

    const clearFieldError = (field: keyof InputErrorState) => {
        setFieldErrors((prev) => ({
            ...prev,
            [field]: { hasError: false, message: '' },
        }));
        setErrors((prev) => {
            const { [field]: _ignored, ...rest } = prev;
            return rest;
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: { backgroundImage: 'none' },
                },
            }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle>Passwort zurücksetzen</DialogTitle>

                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
                >
                    <DialogContentText>
                        Haben Sie Ihr Passwort vergessen? Kein Problem - wir senden Ihnen einen Link
                        zum Zurücksetzen.
                    </DialogContentText>

                    <FormControl fullWidth margin="dense" error={fieldErrors.email.hasError}>
                        <TextField
                            error={fieldErrors.email.hasError}
                            helperText={fieldErrors.email.message}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="ihreEmail@mustermann.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={fieldErrors.email.hasError ? 'error' : 'primary'}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearFieldError('email');
                            }}
                            value={email}
                        />
                    </FormControl>
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </DialogContent>

                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Abbrechen
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Senden...' : 'Link senden'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
