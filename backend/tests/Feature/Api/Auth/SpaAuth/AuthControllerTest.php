<?php

use App\Models\User;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;
use App\Enums\UserRole;
use App\Enums\RecaptchaAction;

// -------------------------------------------------
// Register Tests
// -------------------------------------------------
it('registers a new user and logs them in', function () {
    $response = postJson('/register', withRecaptchaPayload([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ], RecaptchaAction::Register));

    $response->assertOk();
    assertUserResponseStructure($response);
    assertLoggedIn();
});

it('fails to register user with invalid input', function () {
    $recaptcha = fakeRecaptcha(RecaptchaAction::Register);

    $response = postJson('/register', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => '123',
        'password_confirmation' => 'wrong',
    ] + $recaptcha);

    $response->assertStatus(422);
    $response->assertInvalid(['name', 'email', 'password']);
    assertLoggedOut();
});

it('rejects registration with duplicate email', function () {
    $recaptcha = fakeRecaptcha(RecaptchaAction::Register);

    User::factory()->create(['email' => 'taken@example.com']);

    $response = postJson('/register', [
        'name' => 'Another User',
        'email' => 'taken@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ] + $recaptcha);

    $response->assertStatus(422);
    assertLoggedOut();
});

// -------------------------------------------------
// Login Tests
// -------------------------------------------------
it('logs in an existing user', function () {
    $user = loginWebUser(['password' => bcrypt('secret123')]);

    $response = postJson('/login', withRecaptchaPayload([
        'email' => $user->email,
        'password' => 'secret123',
    ], RecaptchaAction::Login));

    $response->assertOk()
             ->assertJson(['message' => 'Sie haben sich erfolgreich angemeldet.']);

    assertLoggedIn($user);
});

it('fails to log in with wrong credentials', function () {
    $recaptcha = fakeRecaptcha(RecaptchaAction::Login);

    $user = loginUser(null, false);
    $user->update(['password' => bcrypt('correct')]);

    $response = postJson('/login', [
        'email' => $user->email,
        'password' => 'wrong',
    ] + $recaptcha);

    $response->assertInvalid('email');
    assertLoggedOut();
});

it('fails login with missing credentials', function () {
    $recaptcha = fakeRecaptcha(RecaptchaAction::Login);

    $response = postJson('/login', $recaptcha);

    $response->assertStatus(422);
    $response->assertInvalid(['email', 'password']);
    assertLoggedOut();
});

// -------------------------------------------------
// Logout Test
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
// /me Route Test
// -------------------------------------------------
it('returns the authenticated user', function () {
    $user = loginWebUser();

    $response = getJson('/me');

    $response->assertOk()
             ->assertJsonFragment([
                 'id' => $user->id,
                 'email' => $user->email,
             ]);

    assertLoggedIn($user);
});

it('returns full authenticated user profile including role', function () {
    $user = loginWebUser(['role' => UserRole::Admin]);

    $response = getJson('/me');

    $response->assertOk()
             ->assertJsonFragment([
                 'email' => $user->email,
                 'role' => UserRole::Admin->value,
             ]);

    assertLoggedIn($user);
});