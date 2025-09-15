<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\post;
use function Pest\Laravel\get;
use function Pest\Laravel\postJson;
use App\Enums\UserRole;


// Register
it('registers a new user and logs them in', function () {
  $response = post('/register', [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
  ]);

  $response->assertOk();
  $response->assertJsonStructure(['name', 'email']);

  expect(auth()->check())->toBeTrue();
});

it('fails to register user with invalid input', function () {
  $response = postJson('/register', [
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

  $response = postJson('/register', [
    'name' => 'Another User',
    'email' => 'taken@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
  ]);

  $response->assertStatus(422);
});

// Login
it('logs in an existing user', function () {
  $user = User::factory()->create([
    'email' => 'test@example.com',
    'password' => Hash::make('secret123'),
  ]);

  $response = post('/login', [
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

  $response = postJson('/login', [
    'email' => 'wrong@example.com',
    'password' => 'wrong',
  ]);

  $response->assertInvalid('email');
  expect(auth()->check())->toBeFalse();
});

it('fails login with missing credentials', function () {
  $response = postJson('/login', []);

  $response->assertStatus(422);
  $response->assertInvalid(['email', 'password']);
});

// Logout
it('logs out an authenticated user', function () {
  $user = User::factory()->create([
    'password' => Hash::make('password123'),
  ]);

  $this->actingAs($user); // session-based

  $response = post('/logout');

  $response->assertOk();
  $response->assertJson(['message' => 'Sie haben sich erfolgreich abgemeldet.']);

  expect(auth()->check())->toBeFalse();
});

// /me (Sanctum protected)
it('returns the authenticated user', function () {
  $user = User::factory()->create();
  $this->actingAsSessionUser($user);

  $response = get('/me');

  $response->assertOk();
  $response->assertJson([
    'id' => $user->id,
    'email' => $user->email,
  ]);
});

it('returns full authenticated user profile structure', function () {
  $user = User::factory()->create();
  $this->actingAsSessionUser($user);

  $response = get('/me');

  $response->assertOk();

  $response->assertJsonStructure([
        'id',
        'name',
        'email',
        'role',
  ]);

  $response->assertJson([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => UserRole::User->value,
  ]);
});

it('returns the authenticated user including role', function () {
    $user = User::factory()->admin()->create();
    $this->actingAsSessionUser($user);

    $response = get('/me');

    $response->assertOk()
        ->assertJsonFragment([
            'email' => $user->email,
            'role' => UserRole::Admin->value,
        ]);
});


// Guest access denied
it('returns 401 for unauthenticated user calling me', function () {
  $response = $this->getJson('/me');

  $response->assertStatus(401);
});
