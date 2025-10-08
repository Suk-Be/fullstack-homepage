<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = createUser();
    loginUser($this->user);
});

it('returns a list of grids for the authenticated user', function () {
    $grids = createGrids($this->user, 3);

    $response = $this->getJson(route('grids.index'));

    $response->assertOk()
        ->assertJsonCount(3, 'data');

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
    $grid = createGrids($this->user, 1)->first();
    $grid->name = 'Old Name';
    $grid->save();

    $payload = ['name' => 'Updated Name'];

    $response = $this->putJson(route('grids.update', $grid), $payload);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Updated Name']);

    expect($grid->fresh()->name)->toBe('Updated Name');
});

it('can delete a grid by its layoutId', function () {
    $grid = createGrids($this->user, 1)->first();
    $grid->layout_id = '123e4567-e89b-12d3-a456-426614174000';
    $grid->save();

    $response = $this->deleteJson(route('grids.layout.destroy', $grid->layout_id));

    $response->assertNoContent();
    expect(Grid::count())->toBe(0);
});

it('denies another user from deleting a grid by layoutId', function () {
    $owner = createUser();
    $grid = createGrids($owner, 1)->first();
    $grid->layout_id = '123e4567-e89b-12d3-a456-426614174000';
    $grid->save();

    loginUser(createUser());
    $response = $this->deleteJson(route('grids.layout.destroy', $grid->layout_id));
    $response->assertForbidden();
});

it('denies a regular user from resetting their own grids', function () {
    createGrids($this->user, 5);

    $response = $this->deleteJson(route('grids.user.reset', $this->user->id));
    $response->assertForbidden();
    expect(Grid::where('user_id', $this->user->id)->count())->toBe(5);
});

it('denies an admin from resetting another users grids', function () {
    $admin = createUser(['role' => 'admin']);
    loginUser($admin);

    $otherUser = createUser();
    createGrids($otherUser, 5);

    $response = $this->deleteJson(route('grids.user.reset', $otherUser->id));
    $response->assertForbidden();
    expect(Grid::where('user_id', $otherUser->id)->count())->toBe(5);
});

it('returns only the authenticated users own grids via myGrids', function () {
    $ownGrids = createGrids($this->user, 3);
    $otherUser = createUser();
    createGrids($otherUser, 2);

    $response = $this->getJson(route('grids.index'));

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

// ----------------------------------------
// Erfolgreiches Umbenennen eines Grids
// ----------------------------------------
it('successfully renames a grid by layoutId', function () {
    $grid = createGrids($this->user, 1, [
        'layout_id' => 'layout-1',
        'name' => 'Old Name',
    ])->first();

    $payload = ['name' => 'New Unique Name'];

    $response = $this->patchJson(route('grids.layout.update', $grid->layout_id), $payload);

    $response->assertOk();
    $response->assertJsonPath('message', 'Grid name successfully updated.');
    $response->assertJsonPath('data.name', 'New Unique Name');

    expect($grid->fresh()->name)->toBe('New Unique Name');
});

// ----------------------------------------
// Fehler bei Duplikatname
// ----------------------------------------
it('returns error if another grid already has the same name', function () {
    // Erstes Grid mit existierendem Namen
    $existingGrid = Grid::create([
        'user_id' => $this->user->id,
        'layout_id' => 'layout-1',
        'name' => 'Existing Name',
        'config' => ['columns' => 3],
        'timestamp' => now(),
    ]);

    // Zweites Grid, das umbenannt werden soll
    $gridToUpdate = Grid::create([
        'user_id' => $this->user->id,
        'layout_id' => 'layout-2',
        'name' => 'Original Name',
        'config' => ['columns' => 4],
        'timestamp' => now(),
    ]);

    $payload = ['name' => 'Existing Name'];

    $response = $this->patchJson(route('grids.layout.update', $gridToUpdate->layout_id), $payload);

    $response->assertStatus(422)
             ->assertJsonFragment([
                 'errors' => ['general' => ['A grid with this name already exists.']]
             ]);

    expect($gridToUpdate->fresh()->name)->toBe('Original Name');
});

// ----------------------------------------
// Andere User dürfen nicht updaten
// ----------------------------------------
it('forbids another user from updating a grid they do not own', function () {
    $owner = createUser();
    $grid = Grid::create([
        'user_id' => $owner->id,
        'layout_id' => 'foreign-layout',
        'name' => 'Owner Grid',
        'config' => ['columns' => 3],
        'timestamp' => now(),
    ]);

    // Ein anderer Benutzer loggt sich ein
    loginUser(createUser());

    $response = $this->patchJson(route('grids.layout.update', $grid->layout_id), [
        'name' => 'Attempted Change',
    ]);

    $response->assertForbidden();
    expect($grid->fresh()->name)->toBe('Owner Grid');
});
