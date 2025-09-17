<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('returns a list of grids for the authenticated user', function () {
    Grid::factory()->count(3)->for($this->user)->create();

    $response = $this->getJson(route('grids.index'));

    $response->assertOk()
        ->assertJsonCount(3, 'data');

    $returnedIds = collect($response->json('data'))->pluck('id')->all();
    $expectedIds = Grid::where('user_id', $this->user->id)->pluck('id')->all();
    expect($returnedIds)->toMatchArray($expectedIds);
});

it('can create a new grid', function () {
    $payload = [
        'layout_id' => (string) Str::uuid(),
        'name' => 'My Test Grid',
        'config' => ['columns' => 3],
        'timestamp' => now()->toISOString(),
    ];

    $response = $this->postJson(route('grids.store'), $payload);

    $response->assertCreated()
        ->assertJsonFragment([
            'name' => 'My Test Grid',
        ]);

    expect(Grid::count())->toBe(1);
});

it('validates required fields when creating a grid', function () {
    $response = $this->postJson(route('grids.store'), []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['layout_id', 'config', 'timestamp']);
});

it('can update a grid', function () {
    $grid = Grid::factory()->for($this->user)->create([
        'name' => 'Old Name',
    ]);

    $payload = [
        'name' => 'Updated Name',
    ];

    $response = $this->putJson(route('grids.update', $grid), $payload);

    $response->assertOk()
        ->assertJsonFragment([
            'name' => 'Updated Name',
        ]);

    expect($grid->fresh()->name)->toBe('Updated Name');
});

it('can delete a grid by its layoutId', function () {
    $grid = Grid::factory()->for($this->user)->create([
        'layout_id' => '123e4567-e89b-12d3-a456-426614174000',
    ]);

    $response = $this->deleteJson(route('grids.destroyByLayout', '123e4567-e89b-12d3-a456-426614174000'));

    $response->assertNoContent();

    expect(Grid::count())->toBe(0);
});

it('denies another user from deleting a grid by layoutId', function () {
    // Angemeldeter Benutzer (nicht der Besitzer des Grids)
    $actingUser = User::factory()->create();
    $this->actingAs($actingUser);

    // Der Benutzer, dem das Grid gehört
    $owner = User::factory()->create();
    $grid = Grid::factory()->for($owner)->create([
        'layout_id' => '123e4567-e89b-12d3-a456-426614174000',
    ]);

    // Der angemeldete Benutzer versucht, das fremde Grid zu löschen
    $response = $this->deleteJson(route('grids.destroyByLayout', '123e4567-e89b-12d3-a456-426614174000'));

    // Die Anfrage sollte fehlschlagen, da die Policy den Zugriff verweigert
    $response->assertForbidden();
});

it('denies an admin from resetting another users grids', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $otherUser = User::factory()->create();
    Grid::factory()->count(5)->for($otherUser)->create();

    $response = $this->deleteJson(route('grids.resetUserGrids', $otherUser->id));

    $response->assertForbidden();
    expect(Grid::where('user_id', $otherUser->id)->count())->toBe(5);
});

it('denies a regular user from resetting their own grids', function () {
    Grid::factory()->count(5)->for($this->user)->create();

    $response = $this->deleteJson(route('grids.resetUserGrids', $this->user->id));

    $response->assertForbidden();
    expect(Grid::where('user_id', $this->user->id)->count())->toBe(5);
});

it('denies a user from resetting their own grids via the resetUserGrids route', function () {
    Grid::factory()->count(5)->for($this->user)->create();

    $response = $this->deleteJson(route('grids.resetUserGrids', $this->user->id));

    $response->assertForbidden();
});

it('returns only the authenticated users own grids via myGrids', function () {
    // Grids für den angemeldeten User
    $ownGrids = Grid::factory()->count(3)->for($this->user)->create();

    // Grids für einen anderen User
    $otherUser = User::factory()->create();
    Grid::factory()->count(2)->for($otherUser)->create();

    $response = $this->getJson('/api/user/grids'); // deine Route für myGrids

    $response->assertOk()
        ->assertJsonCount(3, 'data'); // Resource Collection packt Items in "data"

    // Prüfen, dass die IDs nur zu den eigenen Grids gehören
    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->toMatchArray($ownGrids->pluck('id')->all());
});

it('denies access to myGrids if not authenticated', function () {
    // Logout, um sicherzustellen, dass kein User angemeldet ist
    auth()->logout();

    $response = $this->getJson('/api/user/grids');

    $response->assertUnauthorized();
});