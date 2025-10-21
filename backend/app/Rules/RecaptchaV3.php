<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaV3 implements ValidationRule
{
    protected string $action;

    /**
     * Erstellt eine neue Regel-Instanz.
     * @param string $action Die erwartete Aktion (z.B. 'login', 'register').
     */
    public function __construct(string $action = 'submit')
    {
        $this->action = $action;
    }

    /**
     * Führt die Validierungsregel aus.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secretKey = env('RECAPTCHA_SECRET_KEY');
        $threshold = (float) env('RECAPTCHA_SCORE_THRESHOLD', 0.5);

        if (!$secretKey) {
            Log::error('RECAPTCHA_SECRET_KEY fehlt in der .env-Datei. Verifizierung übersprungen.');
            // In der Produktion sollten Sie hier $fail('Konfigurationsfehler.') aufrufen,
            // um zu verhindern, dass die reCAPTCHA-Funktion umgangen wird.
            return;
        }

        // 1. POST-Anfrage an den Google-Verifizierungsdienst senden
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $value, // Das vom Frontend gesendete Token
            'remoteip' => request()->ip(), // Die IP-Adresse des Users (optional)
        ]);

        $responseData = $response->json();

        // 2. Grundlegende Erfolgsprüfung
        if (!($responseData['success'] ?? false)) {
            Log::warning('reCAPTCHA-Verifizierung fehlgeschlagen.', ['errors' => $responseData['error-codes'] ?? 'Keine Fehlercodes']);
            $fail('Die reCAPTCHA-Prüfung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.');
            return;
        }

        $score = $responseData['score'] ?? 0.0;
        $action = $responseData['action'] ?? '';

        // 3. Score- und Aktionsprüfung (v3 spezifisch)
        if ($score < $threshold || $action !== $this->action) {
            Log::warning('reCAPTCHA-Score oder Aktion nicht erfüllt.', [
                'expected_action' => $this->action,
                'received_action' => $action,
                'score' => $score,
                'threshold' => $threshold
            ]);
            $fail('Verdächtige Aktivität erkannt. Bitte versuchen Sie es später erneut oder löschen Sie Cookies.');
        }
    }
}