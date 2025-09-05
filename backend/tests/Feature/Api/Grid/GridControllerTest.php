<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('returns a list of grids for the authenticated user', function () {
    Grid::factory()->count(3)->for($this->user)->create();

    $response = $this->getJson(route('grids.index'));

    $response->assertOk()
        ->assertJsonCount(3);
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

it('can delete a grid', function () {
    $grid = Grid::factory()->for($this->user)->create();

    $response = $this->deleteJson(route('grids.destroy', $grid));

    $response->assertNoContent();

    expect(Grid::count())->toBe(0);
});
