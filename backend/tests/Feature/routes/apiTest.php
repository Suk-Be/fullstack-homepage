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
        $response->assertOk()
                 ->assertJson([
                     'id' => $user->id,
                     'email' => $user->email,
                 ]);
    }

    public function grids_crud_routes_require_authentication()
    {
        $response = $this->getJson('/api/grids');
        $response->assertStatus(401);

        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        // POST /api/grids
        $response = $this->postJson('/api/grids', ['name' => 'Test Grid']);
        $response->assertCreated();

        $gridId = $response->json('id');

        // GET /api/grids
        $this->getJson('/api/grids')->assertOk();

        // GET /api/grids/{id}
        $this->getJson("/api/grids/{$gridId}")
            ->assertOk()
            ->assertJson(['name' => 'Test Grid']);
    }

    public function test_error_routes_return_expected_responses()
    {
        $this->getJson('/api/test-errors/validation-exception')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['required_field', 'another_field']);

        $this->getJson('/api/test-errors/authentication-exception')
            ->assertStatus(401);

        $this->getJson('/api/test-errors/already-authenticated-exception')
            ->assertStatus(403);

        $this->getJson('/api/test-errors/model-not-found-exception/999')
            ->assertStatus(404);

        $this->getJson('/api/test-errors/not-found-http-exception')
            ->assertStatus(404);

        $this->getJson('/api/test-errors/method-not-allowed-http-exception')
            ->assertStatus(405);

        $this->getJson('/api/test-errors/generic-exception')
            ->assertStatus(500);
    }
}
