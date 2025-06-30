const ErrorMessages = {
    SignIn: {
        email: 'Bitte geben Sie eine gültige Email Adresse an.',
        password: 'Das Passwort benötigt mindestens 8 Zeichen.',
        responseEmail: 'Diese E-Mail ist nicht registriert oder das Passwort ist falsch.',
    },
    SignUp: {
        name: 'Bitte vergeben Sie einen Benutzernamen.',
        email: 'Bitte geben Sie eine gültige Email Adresse an.',
        password: 'Das Passwort benötigt mindestens 8 Zeichen.',
        password_confirmation:
            'Die Bestätigung des Passwortes stimmt nicht mit dem Passwort überein.',
        responseEmail: 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
    },
    ResetPassword: {
        email: 'Bitte geben Sie eine gültige Email Adresse an.',
        password: 'Das Passwort benötigt mindestens 8 Zeichen.',
        password_confirmation:
            'Die Bestätigung des Passwortes stimmt nicht mit dem Passwort überein.',
        responseEmail: 'Diese E-Mail ist nicht registriert.',
        urlToken: 'Ungültiger oder fehlender Passwort-Reset-Token.',
        token: 'Passwort-Reset-Token fehlt.'
    },
};

export default ErrorMessages;
