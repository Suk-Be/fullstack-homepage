<?php

use Illuminate\Testing\TestResponse;

/**
 * ------------------------------
 * Assertions
 * ------------------------------
 */

/**
 * Prüft, ob die Response Validierungsfehler enthält.
 *
 * - Ignoriert automatisch das Feld 'recaptcha_token'
 * - Erwartete Felder können als String-Liste oder assoziatives Array mit Fehlermeldungen angegeben werden
 *
 * @param TestResponse $response
 * @param array|string $expectedFields
 * @return void
 * @throws \Exception
 */
function assertJsonValidationError(TestResponse $response, array|string $expectedFields = []): void
{
    $errors = $response->json('errors', []);

    // recaptcha_token automatisch ignorieren
    unset($errors['recaptcha_token']);

    // Wenn nur eine numerische Liste übergeben wurde, in strukturierte Fehlermeldungen konvertieren
    if (is_array($expectedFields) && array_is_list($expectedFields)) {
        $converted = [];
        foreach ($expectedFields as $field) {
            $converted[$field] = ["Das Feld {$field} ist erforderlich."];
        }
        $expectedFields = $converted;
    }

    // Prüfe, dass alle erwarteten Keys in den Response-Errors vorhanden sind
    foreach (array_keys($expectedFields) as $field) {
        if (!isset($errors[$field])) {
            throw new \Exception("Expected validation error for field '{$field}', but not found.");
        }
    }

    // Grundlegende Struktur prüfen
    $response->assertStatus(422)
             ->assertJsonStructure([
                 'message',
                 'errors',
             ])
             ->assertJson(['errors' => $expectedFields]);
}

function assertJsonValidationKeys(TestResponse $response, array $expectedFields): void
{
    $errors = $response->json('errors', []);
    unset($errors['recaptcha_token']);

    foreach ($expectedFields as $field) {
        if (!array_key_exists($field, $errors)) {
            throw new \Exception("Expected validation error for field '{$field}', but not found.");
        }
    }

    $response->assertStatus(422)
             ->assertJsonStructure([
                 'message',
                 'errors',
             ]);
}

/**
 * Assert that a response has the default user JSON structure
 */
function assertUserResponseStructure(TestResponse $response): void
{
    $response->assertJsonStructure([
        'status',
        'data' => [
            'user' => ['id','name','email','role']
        ],
        'message',
    ]);
}

/**
 * Quick helper to assert JSON resource count
 */
function assertJsonCountMatches(TestResponse $response, int $expected, string $key = 'data'): void
{
    $response->assertJsonCount($expected, $key);
}

/**
 * Assert that a response contains a JSON error with optional details
 */
function assertJsonErrorResponse(TestResponse $response, int $status, string $message, array $errors = []): void
{
    $payload = ['message' => $message];
    if (!empty($errors)) {
        $payload['errors'] = $errors;
    }

    $response->assertStatus($status)
             ->assertJson($payload);
}

/**
 * Shortcut for 401 Unauthorized
 */
function assertJsonUnauthorized(TestResponse $response, string $message = 'Nicht authentifiziert.'): void
{
    assertJsonErrorResponse($response, 401, $message);
}

/**
 * Shortcut for 403 Forbidden
 */
function assertJsonForbidden(TestResponse $response, string $message = 'Verboten.'): void
{
    assertJsonErrorResponse($response, 403, $message);
}

/**
 * Shortcut for 404 Not Found
 */
function assertJsonNotFound(TestResponse $response, string $message = 'Ressource nicht gefunden.'): void
{
    assertJsonErrorResponse($response, 404, $message);
}

/**
 * Shortcut for 405 Method Not Allowed
 */
function assertJsonMethodNotAllowed(TestResponse $response, string $message = 'Die HTTP-Methode wird für diese Route nicht unterstützt.'): void
{
    assertJsonErrorResponse($response, 405, $message);
}

/**
 * Shortcut for 500 Internal Server Error
 */
function assertJsonServerError(TestResponse $response, string $message = 'Es ist ein unerwarteter Fehler aufgetreten.'): void
{
    assertJsonErrorResponse($response, 500, $message);
}
