<?php

/**
 * ------------------------------
 * Assertions
 * ------------------------------
 */

/** Assert that a response has the default user JSON structure */
function assertUserResponseStructure($response): void {
    $response->assertJsonStructure([
        'status',
        'data' => [
            'user' => ['id','name','email','role']
        ],
        'message',
    ]);
}

/** Quick helper to assert JSON resource count */
function assertJsonCountMatches($response, int $expected, string $key = 'data'): void {
    $response->assertJsonCount($expected, $key);
}

/** Assert that a response contains a JSON error with optional details */
function assertJsonErrorResponse($response, int $status, string $message, array $errors = []): void
{
    $payload = ['message' => $message];
    if (!empty($errors)) {
        $payload['errors'] = $errors;
    }

    $response->assertStatus($status)
             ->assertJson($payload);
}

function assertJsonValidationError($response, $expectedErrors = []): void
{
    if (is_string($expectedErrors)) {
        // Single error message ohne Feldnamen
        $expectedErrors = ['error' => [$expectedErrors]];
    } elseif (is_array($expectedErrors) && array_is_list($expectedErrors)) {
        // Numerische Liste von Feldnamen -> konvertiere in strukturierte Fehlermeldungen
        $converted = [];
        foreach ($expectedErrors as $field) {
            $converted[$field] = ["Das Feld {$field} ist erforderlich."];
        }
        $expectedErrors = $converted;
    }
    // andernfalls: assoziatives Array bleibt so wie es ist
    $response->assertStatus(422)
             ->assertJsonStructure([
                 'message',
                 'errors'
             ])
             ->assertJson(['errors' => $expectedErrors]);
}

function assertJsonUnauthorized($response, string $message = 'Nicht authentifiziert.'): void {
    assertJsonErrorResponse($response, 401, $message);
}

function assertJsonForbidden($response, string $message = 'Verboten.'): void {
    assertJsonErrorResponse($response, 403, $message);
}

function assertJsonNotFound($response, string $message = 'Ressource nicht gefunden.'): void {
    assertJsonErrorResponse($response, 404, $message);
}

function assertJsonMethodNotAllowed($response, string $message = 'Die HTTP-Methode wird für diese Route nicht unterstützt.'): void {
    assertJsonErrorResponse($response, 405, $message);
}

function assertJsonServerError($response, string $message = 'Es ist ein unerwarteter Fehler aufgetreten.'): void {
    assertJsonErrorResponse($response, 500, $message);
}
