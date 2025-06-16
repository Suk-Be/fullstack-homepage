<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\post;
use function Pest\Laravel\get;
use function Pest\Laravel\postJson;


// 1. Register
it('registers a new user and logs them in', function () {
    $response = post('/api/auth/spa/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['user' => ['id', 'name', 'email']]);

    expect(auth()->check())->toBeTrue();
});

it('fails to register user with invalid input', function () {
    $response = postJson('/api/auth/spa/register', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => '123',
        'password_confirmation' => 'wrong',
    ]);

    $response->assertStatus(422);
    $response->assertInvalid(['name', 'email', 'password']);
});

it('rejects registration with duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = postJson('/api/auth/spa/register', [
        'name' => 'Another User',
        'email' => 'taken@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422);
});

// 2. Login
it('logs in an existing user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $response = post('/api/auth/spa/login', [
        'email' => 'test@example.com',
        'password' => 'secret123',
    ]);

    $response->assertOk();
    $response->assertJson(['message' => 'Sie haben sich erfolgreich angemeldet.']);

    expect(auth()->check())->toBeTrue();
});

it('fails to log in with wrong credentials', function () {
    User::factory()->create([
        'email' => 'wrong@example.com',
        'password' => Hash::make('correct'),
    ]);

    $response = postJson('/api/auth/spa/login', [
        'email' => 'wrong@example.com',
        'password' => 'wrong',
    ]);

    $response->assertInvalid('email');
    expect(auth()->check())->toBeFalse();
});

it('fails login with missing credentials', function () {
    $response = postJson('/api/auth/spa/login', []);

    $response->assertStatus(422);
    $response->assertInvalid(['email', 'password']);
});

// 4. Logout
it('logs out an authenticated user', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $this->actingAs($user); // session-based

    $response = post('/api/auth/spa/logout');

    $response->assertOk();
    $response->assertJson(['message' => 'Sie haben sich erfolgreich abgemeldet.']);

    expect(auth()->check())->toBeFalse();
});

// 5. /api/me (Sanctum protected)
it('returns the authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAsSessionUser($user);

    $response = get('/api/me');

    $response->assertOk();
    $response->assertJson([
        'id' => $user->id,
        'email' => $user->email,
    ]);
});

it('returns full authenticated user profile structure', function () {
    $user = User::factory()->create();
    $this->actingAsSessionUser($user);

    $response = get('/api/me');

    $response->assertOk();
    $response->assertJsonStructure([
        'id',
        'name',
        'email',
        // add custom fields if needed
    ]);
});

// 6. Guest access denied
it('returns 401 for unauthenticated user calling me', function () {
    $response = $this->getJson('/api/me');

    $response->assertStatus(401);
});
