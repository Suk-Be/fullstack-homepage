import { useState } from 'react';
import ErrorMessages from '../data/ErrorMessages';

export default function useValidateInputs() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const passwordConfirmation = document.getElementById(
            'passwordConfirmation',
        ) as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage(ErrorMessages.SignUp.email);
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage(ErrorMessages.SignUp.password);
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!passwordConfirmation.value || passwordConfirmation.value !== password.value) {
            setPasswordConfirmationError(true);
            setPasswordConfirmationErrorMessage(ErrorMessages.SignUp.password_confirmation);
            isValid = false;
        } else {
            setPasswordConfirmationError(false);
            setPasswordConfirmationErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage(ErrorMessages.SignUp.name);
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };

    return {
        emailError,
        emailErrorMessage,
        passwordError,
        passwordErrorMessage,
        passwordConfirmationError,
        passwordConfirmationErrorMessage,
        nameError,
        nameErrorMessage,
        validateInputs,
    };
}
