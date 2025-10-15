<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http; // Besser: Laravel's Http-Client verwenden!

trait Recaptcha
{
    /**
     * Überprüft das reCAPTCHA v3 Token mit der Google API.
     * @param string $token Das reCAPTCHA Token vom Frontend.
     * @param string $action Die erwartete Aktion (z.B. 'login').
     * @throws ValidationException wenn die Verifizierung fehlschlägt.
     */
    protected function verifyRecaptcha(string $token, string $action): array
    {
        $secretKey = env('RECAPTCHA_SECRET_KEY');
        $threshold = (float) env('RECAPTCHA_SCORE_THRESHOLD', 0.5);

        if (!$secretKey) {
             throw new \Exception("RECAPTCHA_SECRET_KEY ist nicht konfiguriert.");
        }

        // 🔹 Anfrage an Google: erwartet form data not json data
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => $secretKey,
            'response' => $token,
            'remoteip' => request()->ip(),
        ]);

        $result = $response->json();

        // 🔹 Logge zusätzlich das Ergebnis von Google
        \Log::debug('🔍 reCAPTCHA verification', [
            'success'  => $result['success'] ?? false,
            'score'    => $result['score'] ?? null,
            'action'   => $result['action'] ?? null,
            'hostname' => $result['hostname'] ?? null,
            'threshold'=> $threshold,
            'expected_action' => $action,
        ]);

        // 🔸 Fehlerhafte Anfrage
        if (empty($result['success'])) {
            \Log::warning('⚠️ reCAPTCHA: verification failed', ['result' => $result]);
            throw ValidationException::withMessages([
                'recaptcha_token' => ['reCAPTCHA Verifizierung fehlgeschlagen.'],
            ]);
        }

        // 🔸 Score prüfen
        if (($result['score'] ?? 1) < $threshold) {
            \Log::warning('🤖 reCAPTCHA: score too low', [
                'score'     => $result['score'] ?? null,
                'threshold' => $threshold,
            ]);
            throw ValidationException::withMessages([
                'recaptcha_token' => ['Niedriger reCAPTCHA-Score erkannt. Verdacht auf Bot-Aktivität.'],
            ]);
        }

        // 🔸 Action prüfen
        if (!empty($action) && isset($result['action']) && $result['action'] !== $action) {
            \Log::warning('⚠️ reCAPTCHA: action mismatch', [
                'expected' => $action,
                'got'      => $result['action'] ?? null,
            ]);
            throw ValidationException::withMessages([
                'recaptcha_token' => ['Ungültige reCAPTCHA-Aktion.'],
            ]);
        }

        return $result;
    }
}
