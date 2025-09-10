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

    public function test_destroy_by_layout_route_is_accessible()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $grid = $user->grids()->create([
            'layout_id' => '123e4567-e89b-12d3-a456-426614174000',
            'config' => ['cols' => 10],
            'timestamp' => now(),
        ]);

        $response = $this->deleteJson("/api/grids/by-layout/{$grid->layout_id}");
        $response->assertStatus(204);

        $this->assertDatabaseMissing('grids', ['id' => $grid->id]);
    }

    public function test_reset_user_grids_route_is_not_accessible_to_admin_for_other_users()
    {
        // Ein Admin muss angemeldet sein
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin, 'sanctum');

        // Erstelle Grids für einen anderen User
        $userToReset = User::factory()->create();
        $userToReset->grids()->createMany([
            ['layout_id' => '223e4567-e89b-12d3-a456-426614174000', 'config' => [], 'timestamp' => now()],
            ['layout_id' => '323e4567-e89b-12d3-a456-426614174000', 'config' => [], 'timestamp' => now()],
        ]);

        // Der Admin versucht, die Grids des anderen Benutzers zu löschen.
        $response = $this->deleteJson("/api/users/{$userToReset->id}/grids");
        $response->assertStatus(403);

        // Überprüfe, dass die Grids NICHT gelöscht wurden
        $this->assertDatabaseCount('grids', 2);
    }
}
