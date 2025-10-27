const inputErrorMessage = {
    name: 'Bitte vergeben Sie einen Benutzernamen.',
    nameLength: 'Der Benutzernamen darf nicht mehr als 50 Zeichen haben.',
    email: 'Bitte geben Sie eine gültige Email Adresse an.',
    emailLength: 'Die E-Mail Adresse darf nicht mehr als 60 Zeichen haben.',
    password: 'Das Passwort benötigt mindestens 8 Zeichen.',
    passwordLength: 'Das Passwort darf maximal 128 Zeichen haben.',
    password_confirmation: 'Die Bestätigung des Passwortes stimmt nicht mit dem Passwort überein.',
    sanitizedInputName: 'Ihre Eingabe wurde bereinigt, bitte prüfen Sie diese.',
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
        responseEmail: 'Es konnte kein Benutzer mit dieser E-Mail-Adresse gefunden werden.',
    },
    recaptcha:
        'Die reCAPTCHA-Prüfung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.',
};

const ErrorMessages = {
    SignIn: {
        email: inputErrorMessage.email,
        emailLength: inputErrorMessage.emailLength,
        password: inputErrorMessage.password,
        passwordLength: inputErrorMessage.passwordLength,
        responseEmail: responseErrorMessages.signIn,
        recaptcha: responseErrorMessages.recaptcha,
    },
    SignUp: {
        name: inputErrorMessage.name,
        nameLength: inputErrorMessage.nameLength,
        email: inputErrorMessage.email,
        emailLength: inputErrorMessage.emailLength,
        password: inputErrorMessage.password,
        password_confirmation: inputErrorMessage.password_confirmation,
        passwordLength: inputErrorMessage.passwordLength,
        sanitizedInputName: inputErrorMessage.sanitizedInputName,
        responseEmail: responseErrorMessages.signUp,
        recaptcha: responseErrorMessages.recaptcha,
    },
    ResetPassword: {
        email: inputErrorMessage.email,
        password: inputErrorMessage.password,
        password_confirmation: inputErrorMessage.password_confirmation,
        passwordLength: inputErrorMessage.passwordLength,
        responseEmail: responseErrorMessages.resetPassword.email,
        urlToken: responseErrorMessages.resetPassword.urlToken,
        token: responseErrorMessages.resetPassword.token,
        sanitizedInputName: inputErrorMessage.sanitizedInputName,
        recaptcha: responseErrorMessages.recaptcha,
    },
    ForgotPassword: {
        email: inputErrorMessage.email,
        emailLength: inputErrorMessage.emailLength,
        responseEmail: responseErrorMessages.forgotPassword.responseEmail,
        urlToken: responseErrorMessages.resetPassword.urlToken,
        token: responseErrorMessages.resetPassword.token,
        sanitizedInputName: inputErrorMessage.sanitizedInputName,
        recaptcha: responseErrorMessages.recaptcha,
    },
};

export default ErrorMessages;
