declare namespace grecaptcha {
    /**
     * Die Hauptfunktion zum Ausführen des reCAPTCHA-Schutzes und zum Abrufen des Tokens.
     * @param sitekey Der öffentliche Site Key.
     * @param options Optionen für die Ausführung, einschließlich der benötigten 'action'.
     * @returns Eine Promise, die mit dem reCAPTCHA Token-String aufgelöst wird.
     */
    function execute(sitekey: string, options: { action: string }): Promise<string>;

    /**
     * Wartet darauf, dass das reCAPTCHA-Skript vollständig geladen ist.
     * @param callback Die Funktion, die ausgeführt werden soll, sobald reCAPTCHA bereit ist.
     */
    function ready(callback: () => void): void;

    // Optional: Fügen Sie bei Bedarf weitere v2/v3-Funktionen hinzu.
}
