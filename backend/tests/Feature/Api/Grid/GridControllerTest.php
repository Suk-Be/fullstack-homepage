<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('returns a list of grids for the authenticated user', function () {
    $grids = Grid::factory()->count(3)->for($this->user)->create();

    $response = $this->getJson(route('grids.index'));

    $response->assertOk()
        ->assertJsonCount(3, 'data');

    // Prüfe, dass layoutId im Response enthalten ist
    $layoutIds = collect($response->json('data'))->pluck('layoutId')->all();
    $expectedIds = $grids->pluck('layout_id')->all();
    expect($layoutIds)->toMatchArray($expectedIds);
});

it('can create a new grid', function () {
    $payload = [
        'layoutId' => (string) Str::uuid(),
        'name' => 'My Test Grid',
        'config' => ['columns' => 3],
        'timestamp' => now()->toISOString(),
    ];

    $response = $this->postJson(route('grids.store'), $payload);

    $response->assertCreated()
        ->assertJsonFragment([
            'name' => 'My Test Grid',
            'layoutId' => $payload['layoutId'],
        ]);

    expect(Grid::count())->toBe(1);
});

it('validates required fields when creating a grid', function () {
    $response = $this->postJson(route('grids.store'), []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['layoutId', 'config', 'timestamp']);
});

it('can update a grid', function () {
    $grid = Grid::factory()->for($this->user)->create([
        'name' => 'Old Name',
    ]);

    $payload = ['name' => 'Updated Name'];

    $response = $this->putJson(route('grids.update', $grid), $payload);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Updated Name']);

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
    $owner = User::factory()->create();
    $grid = Grid::factory()->for($owner)->create([
        'layout_id' => '123e4567-e89b-12d3-a456-426614174000',
    ]);

    $this->actingAs(User::factory()->create());

    $response = $this->deleteJson(route('grids.destroyByLayout', $grid->layout_id));
    $response->assertForbidden();
});

it('denies a regular user from resetting their own grids', function () {
    Grid::factory()->count(5)->for($this->user)->create();

    $response = $this->deleteJson(route('grids.resetUserGrids', $this->user->id));
    $response->assertForbidden();
    expect(Grid::where('user_id', $this->user->id)->count())->toBe(5);
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

it('returns only the authenticated users own grids via myGrids', function () {
    $ownGrids = Grid::factory()->count(3)->for($this->user)->create();
    $otherUser = User::factory()->create();
    Grid::factory()->count(2)->for($otherUser)->create();

    $response = $this->getJson(route('grids.index')); // myGrids Route

    $response->assertOk()
        ->assertJsonCount(3, 'data');

    $layoutIds = collect($response->json('data'))->pluck('layoutId')->all();
    $expectedIds = $ownGrids->pluck('layout_id')->all();
    expect($layoutIds)->toMatchArray($expectedIds);
});

it('denies access to grids if not authenticated', function () {
    auth()->logout();

    $response = $this->getJson(route('grids.index'));
    $response->assertUnauthorized();
});
