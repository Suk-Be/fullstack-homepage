import requestForgotPassword from '@/components/auth/requests/requestForgotPassword';
import SuccessMessages from '@/data/SuccessMessages';
import useInputFocusOnModalOpen from '@/hooks/useInputFocusOnModalOpen';
import setResponseErrorMessage from '@/utils/auth/setResponseErrorMessage';
import { testId } from '@/utils/testId';
import { Box, FormControl, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { FormEvent, useState } from 'react';
import { validateForgotPasswordInput } from './validateForgotInput';

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

interface FieldError {
    hasError: boolean;
    message: string;
}

interface InputErrorState {
    email: FieldError;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    // inputs
    const [email, setEmail] = useState('');
    // frontend input validation errors
    const [fieldErrors, setFieldErrors] = useState<InputErrorState>({
        email: { hasError: false, message: '' },
    });
    // frontend api response validation errors
    // const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    // disable submit button
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const emailRef = useInputFocusOnModalOpen(open);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({
            email: { hasError: false, message: '' },
        });
        setSuccessMessage(null);

        const { isValid, emailError, emailErrorMessage } = validateForgotPasswordInput({ email });

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
            setEmail('');
            setFieldErrors({
                email: { hasError: false, message: '' },
            });
            setSuccessMessage(result.message || SuccessMessages.ForgotPassword.requestSuccess);
            setTimeout(() => {
                setSuccessMessage(null);
                handleClose();
            }, 1000);
        } else {
            const backendRawErrors = result.errors || {};
            const generalErrorMessage = result.message || 'Ein unbekannter Fehler ist aufgetreten.';

            const emailBackendErrorMessage = setResponseErrorMessage(
                backendRawErrors,
                'email',
                generalErrorMessage,
            );

            setFieldErrors({
                email: {
                    hasError: !!emailBackendErrorMessage,
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
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                {...testId('form-forgot-password')}
            >
                <DialogTitle>Passwort zurücksetzen</DialogTitle>

                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
                >
                    <DialogContentText>
                        Haben Sie Ihr Passwort vergessen? Kein Problem - wir senden Ihnen einen Link
                        zum Zurücksetzen.
                    </DialogContentText>

                    <FormControl fullWidth margin="dense">
                        <FormLabel htmlFor="email">
                            Geben Sie bitte die verwendete Email Adresse an
                        </FormLabel>
                        <TextField
                            error={fieldErrors.email.hasError}
                            helperText={fieldErrors.email.message}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="ihreEmail@mustermann.com"
                            autoComplete="email"
                            required
                            fullWidth
                            autoFocus={open}
                            variant="outlined"
                            color={fieldErrors.email.hasError ? 'error' : 'primary'}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearFieldError('email');
                            }}
                            value={email}
                            inputRef={emailRef}
                            {...testId('email-forgot-password')}
                        />
                    </FormControl>
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </DialogContent>

                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Abbrechen
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        {...testId('submit-forgot-password')}
                    >
                        {isSubmitting ? 'Senden...' : 'Link senden'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
