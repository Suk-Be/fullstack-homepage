<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function me_route_requires_authentication()
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401); // Nicht authentifiziert

        $user = User::factory()->create();
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');
        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $user->id,
                     'email' => $user->email,
                 ]);
    }

    public function grids_crud_routes_require_authentication()
    {
        $response = $this->getJson('/api/grids');
        $response->assertStatus(401); // Nicht authentifiziert

        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // GET /api/grids
        $response = $this->getJson('/api/grids');
        $response->assertStatus(200);

        // POST /api/grids
        $response = $this->postJson('/api/grids', ['name' => 'Test Grid']);
        $response->assertStatus(201);

        // GET /api/grids/{id}
        $gridId = $response->json('id');
        $response = $this->getJson("/api/grids/{$gridId}");
        $response->assertStatus(200)
                 ->assertJson(['name' => 'Test Grid']);
    }

    public function test_error_routes_return_expected_responses()
    {
        // ValidationException
        $response = $this->getJson('/api/test-errors/validation-exception');
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['required_field', 'another_field']);

        // AuthenticationException
        $response = $this->getJson('/api/test-errors/authentication-exception');
        $response->assertStatus(401);

        // AlreadyAuthenticatedException
        $response = $this->getJson('/api/test-errors/already-authenticated-exception');
        $response->assertStatus(403);

        // ModelNotFoundException
        $response = $this->getJson('/api/test-errors/model-not-found-exception/999');
        $response->assertStatus(404);

        // NotFoundHttpException
        $response = $this->getJson('/api/test-errors/not-found-http-exception');
        $response->assertStatus(404);

        // MethodNotAllowedHttpException
        $response = $this->getJson('/api/test-errors/method-not-allowed-http-exception');
        $response->assertStatus(405);

        // Generic Exception
        $response = $this->getJson('/api/test-errors/generic-exception');
        $response->assertStatus(500);
    }

    public function spa_auth_routes_are_accessible()
    {
        // Nur prüfen, dass die Routes existieren und 200/422 zurückgeben
        $response = $this->post('/api/auth/spa/register', []);
        $response->assertStatus(422); // Validierungsfehler wegen fehlender Daten

        $response = $this->post('/api/auth/spa/login', []);
        $response->assertStatus(422);
    }
}
