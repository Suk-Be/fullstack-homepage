<?php

namespace Tests\Feature\Exceptions;

use function Pest\Laravel\getJson;
use App\Models\User;
use Illuminate\Support\Facades\Route;


// Note: Ensure your test routes in routes/api.php are active
// by having APP_ENV set to 'local', 'testing', or 'development' in your .env.testing file
// or your main .env if running without a dedicated .env.testing.

it('handles ValidationException for missing required fields correctly (422)', function () {
    $response = getJson('/api/test-errors/validation-exception');

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Das erforderliche Feld ist nicht da. (and 1 more error)', // Match actual output
            'errors' => [
                'required_field' => [
                    'Das erforderliche Feld ist nicht da.' // Match actual German error
                ],
                'another_field' => [
                    'Dies ist ein weiterer Validierungsfehler.' // Add expectation for the second field
                ]
            ]
        ]);
});

it('handles ValidationException thrown explicitly from business logic correctly (422)', function () {
    $response = getJson('/api/test-errors/custom-validation-exception');

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Dies ist eine benutzerdefinierte Validierung-Fehlermeldung.',
            'errors' => [
                'custom_field' => [
                    'Dies ist eine benutzerdefinierte Validierung-Fehlermeldung.'
                ]
            ]
        ]);
});

it('handles AuthenticationException correctly (401)', function () {
    $response = getJson('/api/test-errors/authentication-exception');

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Nicht authentifiziert.'
        ]);
});

it('handles AlreadyAuthenticatedException correctly (403)', function () {
    // For a realistic test, you might first log in a user:
    $user = User::factory()->create();
    $this->actingAs($user); // Use actingAs for session-based auth

    $response = getJson('/api/test-errors/already-authenticated-exception');

    $response->assertStatus(403)
        ->assertJson([
            'message' => __('Bereits authentifiziert') // Assumes the translation is available and correct
        ]);
});

it('handles ModelNotFoundException correctly (404)', function () {
    // Attempt to find a user with an ID that definitely does not exist (e.g., 0)
    $response = getJson('/api/test-errors/model-not-found-exception/0');

    $response->assertStatus(404)
        ->assertJson([
            'message' => 'Ressource nicht gefunden.'
        ]);
});

it('handles NotFoundHttpException for non-existent routes correctly (404)', function () {
    $response = getJson('/api/non-existent-route-for-testing-12345');

    $response->assertStatus(404)
        ->assertJson([
            'message' => 'Ressource nicht gefunden.'
        ]);
});

it('handles MethodNotAllowedHttpException correctly (405)', function () {
    $response = getJson('/api/test-errors/method-not-allowed-http-exception');

    $response->assertStatus(405)
        ->assertJson([
            'message' => 'Die HTTP-Methode wird für diese Route nicht unterstützt.'
        ]);
});

it('handles generic Exception with 500 status correctly', function () {
    $response = getJson('/api/test-errors/generic-exception');

    $response->assertStatus(500)
        ->assertJson([
            'message' => 'Es ist ein unerwarteter Fehler aufgetreten.',
        ]);
});

it('does not apply custom json handling for non-json requests', function () {
    Route::get('/test-web-exception', function () {
        throw new \Exception('Web exception for test!');
    });

    // Make a regular GET request (not getJson)
    $response = $this->get('/test-web-exception');

    // It should not return JSON, but rather Laravel's default error page HTML
    $response->assertStatus(500);
    $response->assertHeader('Content-Type', 'text/html; charset=UTF-8');
    $response->assertHeaderMissing('application/json');
    $response->assertSeeText('Web exception for test!');
});

afterAll(function () {
    if (app()->environment('testing')) { // Only run during tests
    }
});
