<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\post;
use function Pest\Laravel\get;
use function Pest\Laravel\postJson;
use App\Enums\UserRole;

// assertUserResponseStructure ist global eingebunden, siehe Pest.php

// -------------------------------------------------
// Register
// -------------------------------------------------
it('registers a new user and logs them in', function () {
    $response = post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertOk();
    assertUserResponseStructure($response);

    // Prüft, dass der Benutzer nach Registrierung eingeloggt ist
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

// -------------------------------------------------
// Login
// -------------------------------------------------
it('logs in an existing user', function () {
    createUserWithPassword('secret123', ['email' => 'test@example.com']);

    $response = post('/login', [
        'email' => 'test@example.com',
        'password' => 'secret123',
    ]);

    $response->assertOk()
             ->assertJson(['message' => 'Sie haben sich erfolgreich angemeldet.']);

    expect(auth()->check())->toBeTrue();
});

it('fails to log in with wrong credentials', function () {
    createUserWithPassword('correct', ['email' => 'wrong@example.com']);

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

// -------------------------------------------------
// Logout
// -------------------------------------------------
it('logs out an authenticated user', function () {
    $user = createUserWithPassword('password123');
    loginUser($user);

    $this->post('/logout')
         ->assertOk()
         ->assertJson([
             'message' => 'Sie haben sich erfolgreich abgemeldet.'
         ]);

    expect(session()->has('login_web'))->toBeFalse();
});

// -------------------------------------------------
// /me Route (Session-authenticated user)
// -------------------------------------------------
it('returns the authenticated user', function () {
    $user = loginUser();

    $response = get('/me');

    $response->assertOk()
             ->assertJson([
                 'data' => [
                     'user' => [
                         'id' => $user->id,
                         'email' => $user->email,
                     ]
                 ]
             ]);
});

it('returns full authenticated user profile structure', function () {
    $user = loginUser();

    $response = get('/me');

    $response->assertOk();
    $response->assertJsonStructure([
        'data' => [
            'user' => [
                'id',
                'name',
                'email',
                'role',
            ]
        ],
        'status',
        'message',
    ]);

    $response->assertJson([
        'data' => [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => UserRole::User->value,
            ]
        ]
    ]);
});

it('returns the authenticated user including role', function () {
    $user = createUser(['role' => UserRole::Admin]);
    loginUser($user);

    $response = get('/me');

    $response->assertOk()
             ->assertJsonFragment([
                 'email' => $user->email,
                 'role' => UserRole::Admin->value,
             ]);
});

// -------------------------------------------------
// Guest access denied
// -------------------------------------------------
it('returns 401 for unauthenticated user calling /me', function () {
    $response = $this->getJson('/me');

    $response->assertStatus(401);
});