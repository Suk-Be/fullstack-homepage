<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// -------------------------------------------------
// Authentifizierung prüfen (Session-basiert)
// -------------------------------------------------
it('requires authentication for /api/grids', function () {
    $this->getJson('/api/grids')->assertUnauthorized();
});

// -------------------------------------------------
// Grids CRUD (Session-authenticated user)
// -------------------------------------------------
it('can create a new grid', function () {
    $user = loginWebUser(); // Authentifizierter Benutzer (Web-Session)

    $payload = makeGridPayload();
    $response = $this->postJson('/api/grids', $payload);

    $response->assertCreated()
             ->assertJsonFragment(['name' => $payload['name']]);

    expect(Grid::count())->toBe(1);
});

it('can get a list of grids for authenticated user', function () {
    $user = loginWebUser();
    createUserGrids($user, 3);

    $response = $this->getJson('/api/grids');
    $response->assertOk()
             ->assertJsonCount(3, 'data');
});

it('can update a grid', function () {
    $user = loginWebUser();
    $grid = createUserGrids($user, 1)->first();

    $payload = ['name' => 'Updated Name'];
    $response = $this->putJson("/api/grids/{$grid->id}", $payload);

    $response->assertOk()
             ->assertJsonFragment(['name' => 'Updated Name']);

    expect($grid->fresh()->name)->toBe('Updated Name');
});

it('can delete a grid by layout_id', function () {
    $user = loginWebUser();
    $grid = createUserGrids($user, 1, ['layout_id' => '123e4567-e89b-12d3-a456-426614174000'])->first();

    $response = $this->deleteJson("/api/grids/by-layout/{$grid->layout_id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('grids', ['id' => $grid->id]);
});

it('denies another user from deleting a grid they do not own', function () {
    $owner = createUser();
    $grid = createUserGrids($owner)->first();

    $nonOwner = loginWebUser(); // Benutzer ohne Rechte
    $response = $this->deleteJson("/api/grids/by-layout/{$grid->layout_id}");

    $response->assertForbidden();
});

// -------------------------------------------------
// /user/grids Route (Session-authenticated user)
// -------------------------------------------------
it('returns only the authenticated users grids via /user/grids', function () {
    $user = loginWebUser();
    $userGrids = createUserGrids($user, 2);

    $otherUser = createUser();
    createUserGrids($otherUser);

    $response = $this->getJson('/api/user/grids');
    $response->assertOk()
             ->assertJsonCount(2, 'data');

    $returnedIds = collect($response->json('data'))->pluck('id')->all();
    expect($returnedIds)->toMatchArray($userGrids->pluck('id')->all());
});

it('requires authentication to access /user/grids', function () {
    $this->getJson('/api/user/grids')->assertUnauthorized();
});

// -------------------------------------------------
// Admin: reset user grids (Session-authenticated user)
// -------------------------------------------------
it('denies admin from resetting another users grids', function () {
    $admin = loginWebUser(['role' => 'admin']); // Admin-Benutzer
    $targetUser = createUser();
    createUserGrids($targetUser, 2);

    $response = $this->deleteJson("/api/users/{$targetUser->id}/grids");

    $response->assertForbidden();
    $this->assertDatabaseCount('grids', 2);
});
