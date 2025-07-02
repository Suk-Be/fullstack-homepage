const inputErrorMessage = {
    name: 'Bitte vergeben Sie einen Benutzernamen.',
    email: 'Bitte geben Sie eine gültige Email Adresse an.',
    password: 'Das Passwort benötigt mindestens 8 Zeichen.',
    password_confirmation: 'Die Bestätigung des Passwortes stimmt nicht mit dem Passwort überein.',
};

const responseTokenErrors = {
    urlToken: 'Ungültiger oder fehlender Passwort-Reset-Token.',
    token: 'Passwort-Reset-Token fehlt.',
};

const responseErrorMessages = {
    signIn: 'Diese E-Mail ist nicht registriert oder das Passwort ist falsch.',
    signUp: 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
    resetPassword: {
        email: 'Diese E-Mail ist nicht registriert.',
        urlToken: responseTokenErrors.urlToken,
        token: responseTokenErrors.token,
    },
    forgotPassword: {
        responseEmail: 'Diese E-Mail ist nicht registriert.',
    },
};
const ErrorMessages = {
    SignIn: {
        email: inputErrorMessage.email,
        password: inputErrorMessage.password,
        responseEmail: responseErrorMessages.signIn,
    },
    SignUp: {
        name: inputErrorMessage.name,
        email: inputErrorMessage.email,
        password: inputErrorMessage.password,
        password_confirmation: inputErrorMessage.password_confirmation,
        responseEmail: responseErrorMessages.signUp,
    },
    ResetPassword: {
        email: inputErrorMessage.email,
        password: inputErrorMessage.password,
        password_confirmation: inputErrorMessage.password_confirmation,
        responseEmail: responseErrorMessages.resetPassword.email,
        urlToken: responseErrorMessages.resetPassword.urlToken,
        token: responseErrorMessages.resetPassword.token,
    },
    ForgotPassword: {
        email: inputErrorMessage.email,
        responseEmail: responseErrorMessages.forgotPassword.responseEmail,
        urlToken: responseErrorMessages.resetPassword.urlToken,
        token: responseErrorMessages.resetPassword.token,
    },
};

export default ErrorMessages;
