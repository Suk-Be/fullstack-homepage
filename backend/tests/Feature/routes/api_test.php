<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

// -------------------------------------------------
// Authentifizierung prüfen
// -------------------------------------------------
it('requires authentication for /api/grids', function () {
    $response = $this->getJson('/api/grids');
    $response->assertUnauthorized();
});

// -------------------------------------------------
// Grids CRUD
// -------------------------------------------------
it('can create a new grid', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $payload = [
        'layout_id' => (string) \Illuminate\Support\Str::uuid(),
        'name' => 'Test Grid',
        'config' => ['columns' => 3],
        'timestamp' => now()->toISOString(),
    ];

    $response = $this->postJson('/api/grids', $payload);

    $response->assertCreated()
             ->assertJsonFragment(['name' => 'Test Grid']);

    expect(Grid::count())->toBe(1);
});

it('can get a list of grids for authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    Grid::factory()->count(3)->for($user)->create();

    $response = $this->getJson('/api/grids');

    $response->assertOk()
             ->assertJsonCount(3, 'data');
});

it('can update a grid', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $grid = Grid::factory()->for($user)->create(['name' => 'Old Name']);

    $payload = ['name' => 'Updated Name'];
    $response = $this->putJson("/api/grids/{$grid->id}", $payload);

    $response->assertOk()
             ->assertJsonFragment(['name' => 'Updated Name']);

    expect($grid->fresh()->name)->toBe('Updated Name');
});

it('can delete a grid by layout_id', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $grid = $user->grids()->create([
        'layout_id' => '123e4567-e89b-12d3-a456-426614174000',
        'config' => ['cols' => 10],
        'timestamp' => now(),
    ]);

    $response = $this->deleteJson("/api/grids/by-layout/{$grid->layout_id}");
    $response->assertNoContent();

    $this->assertDatabaseMissing('grids', ['id' => $grid->id]);
});

it('denies another user from deleting a grid they do not own', function () {
    $owner = User::factory()->create();
    $grid = Grid::factory()->for($owner)->create();

    $otherUser = User::factory()->create();
    $this->actingAs($otherUser, 'sanctum');

    $response = $this->deleteJson("/api/grids/by-layout/{$grid->layout_id}");
    $response->assertForbidden();
});

// -------------------------------------------------
// /user/grids Route
// -------------------------------------------------
it('returns only the authenticated users grids via /user/grids', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $userGrids = $user->grids()->createMany([
        ['layout_id' => '123e4567-e89b-12d3-a456-426614174001', 'config' => ['cols' => 3], 'timestamp' => now()],
        ['layout_id' => '123e4567-e89b-12d3-a456-426614174002', 'config' => ['cols' => 4], 'timestamp' => now()],
    ]);

    $otherUser = User::factory()->create();
    $otherUser->grids()->create([
        'layout_id' => '223e4567-e89b-12d3-a456-426614174000',
        'config' => ['cols' => 5],
        'timestamp' => now(),
    ]);

    $response = $this->getJson('/api/user/grids');

    $response->assertOk()
             ->assertJsonCount(2, 'data');

    $returnedIds = collect($response->json('data'))->pluck('id')->all();
    $expectedIds = $userGrids->pluck('id')->all();
    expect($returnedIds)->toMatchArray($expectedIds);
});

it('requires authentication to access /user/grids', function () {
    $response = $this->getJson('/api/user/grids');
    $response->assertUnauthorized();
});

// -------------------------------------------------
// Admin: reset user grids
// -------------------------------------------------
it('denies admin from resetting another users grids', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin, 'sanctum');

    $otherUser = User::factory()->create();
    $otherUser->grids()->createMany([
        ['layout_id' => '223e4567-e89b-12d3-a456-426614174000', 'config' => [], 'timestamp' => now()],
        ['layout_id' => '323e4567-e89b-12d3-a456-426614174000', 'config' => [], 'timestamp' => now()],
    ]);

    $response = $this->deleteJson("/api/users/{$otherUser->id}/grids");
    $response->assertForbidden();

    $this->assertDatabaseCount('grids', 2);
});
