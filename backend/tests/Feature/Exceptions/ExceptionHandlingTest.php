<?php

namespace Tests\Feature\Exceptions;

use App\Models\User;
use function Pest\Laravel\getJson;

it('handles ValidationException for missing required fields correctly', function () {
    $response = getJson('/api/test-errors/validation-exception');

    assertJsonValidationError($response, [
        'required_field' => ['Das erforderliche Feld ist nicht da.'],
        'another_field' => ['Dies ist ein weiterer Validierungsfehler.'],
    ]);
});

it('handles custom ValidationException from business logic', function () {
    $response = getJson('/api/test-errors/custom-validation-exception');

    assertJsonValidationError($response, [
        'custom_field' => ['Dies ist eine benutzerdefinierte Validierung-Fehlermeldung.'],
    ]);
});

it('handles AlreadyAuthenticatedException correctly', function () {
    $user = createUser();
    $this->actingAs($user);

    $response = getJson('/api/test-errors/already-authenticated-exception');
    assertJsonForbidden($response, __('Bereits authentifiziert'));
});

it('handles ModelNotFoundException correctly', function () {
    $response = getJson('/api/test-errors/model-not-found-exception/0');
    assertJsonNotFound($response);
});

it('handles NotFoundHttpException correctly for non-existent routes', function () {
    $response = getJson('/api/non-existent-route-for-testing-12345');
    assertJsonNotFound($response);
});

it('handles MethodNotAllowedHttpException correctly', function () {
    $response = getJson('/api/test-errors/method-not-allowed-http-exception');
    assertJsonMethodNotAllowed($response);
});

it('handles generic Exception with 500 status correctly', function () {
    $response = getJson('/api/test-errors/generic-exception');
    assertJsonServerError($response);
});

it('does not apply custom json handling for non-json requests', function () {
    registerTestRouteWithException('/test-web-exception', new \Exception('Web exception for test!'));
    $response = $this->get('/test-web-exception');

    $response->assertStatus(500);
    $response->assertHeader('Content-Type', 'text/html; charset=UTF-8');
    $response->assertHeaderMissing('application/json');
    $response->assertSeeText('Web exception for test!');
});
