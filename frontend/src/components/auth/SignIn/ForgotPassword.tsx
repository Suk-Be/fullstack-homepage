import { FormControl, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { ZodError, ZodFormattedError } from 'zod';
import { ForgotPasswordSchema } from '../../../schemas/forgotPasswordSchema';
import setResponseErrorMessage from '../../../utils/auth/setResponseErrorMessage';
import requestForgotPassword from './requestForgorPassword';

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

type FieldError = {
    hasError: boolean;
    message: string;
};

type FormErrors = {
    email: FieldError;
};

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({
        email: { hasError: false, message: '' },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // This handleSubmit will now be called by the Dialog's form directly
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({ email: { hasError: false, message: '' } });
        setSuccessMessage(null);

        try {
            ForgotPasswordSchema.parse({ email });
        } catch (error) {
            if (error instanceof ZodError) {
                const formatted: ZodFormattedError<(typeof ForgotPasswordSchema)['_output']> =
                    error.format();
                setFieldErrors({
                    email: {
                        hasError: Boolean(formatted.email?._errors?.[0]),
                        message: formatted.email?._errors?.[0] || '',
                    },
                });
            }
            setIsSubmitting(false);
            return;
        }

        const result = await requestForgotPassword(email);

        if (result.success) {
            setSuccessMessage(
                result.message ||
                    'Passwort-Reset-Link gesendet. Bitte überprüfen Sie Ihre E-Mails.',
            );
            setEmail(''); // Clear email field on success
            setTimeout(() => handleClose(), 1000); // close the dialog after a successful submission
        } else {
            const backendRawErrors = result.errors || {};
            const emailErrorToDisplay = setResponseErrorMessage(
                backendRawErrors,
                'email',
                result.message || 'Ein Fehler ist aufgetreten beim Senden des Links.',
            );
            setFieldErrors({
                email: { hasError: !!emailErrorToDisplay, message: emailErrorToDisplay },
            });
        }
        setIsSubmitting(false);
    };

    const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setFieldErrors((prev) => ({ ...prev, email: { hasError: false, message: '' } }));
        setSuccessMessage(null); // Clear success message when typing
    }, []);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form', // This is now your ONLY form
                    onSubmit: handleSubmit,
                    sx: { backgroundImage: 'none' },
                },
            }}
        >
            <DialogTitle>Passwort zurücksetzen</DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <DialogContentText>
                    Haben Sie Ihr Passwort vergessen? Kein Problem - wir senden Ihnen einen Link zum
                    Zurücksetzen.
                </DialogContentText>

                <FormControl fullWidth margin="dense" error={fieldErrors.email.hasError}>
                    <OutlinedInput
                        autoFocus
                        required
                        id="email"
                        name="email"
                        placeholder="Email address"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        aria-describedby="forgot-password-email-helper-text"
                    />
                    {fieldErrors.email.message && (
                        <FormHelperText id="forgot-password-email-helper-text">
                            {fieldErrors.email.message}
                        </FormHelperText>
                    )}
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
        </Dialog>
    );
}
