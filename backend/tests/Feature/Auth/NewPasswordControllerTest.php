<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

it('can reset a password with a valid token and email', function () {
    Event::fake();

    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);

    // Simulate the user requesting a password reset
    Password::shouldReceive('reset')
        ->once()
        ->andReturn(Password::PASSWORD_RESET)
        ->withArgs(function ($credentials, $callback) use ($user) {
            // Ensure the callback is executed with the user
            $callback($user);
            return true;
        });

    // Simulate the request to the controller
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-reset-token',
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);


    $response->assertOk();
    $response->assertJson(['status' => __('passwords.reset')]);

    // user's password was updated and logged in
    $user->refresh();
    expect(Hash::check('new-password', $user->password))->toBeTrue();
    expect(Auth::check())->toBeTrue();
    expect(Auth::user()->is($user))->toBeTrue();

    // Assert the PasswordReset event was dispatched
    Event::assertDispatched(PasswordReset::class, function ($event) use ($user) {
        return $event->user->is($user);
    });
});


it('fails to reset password with an invalid token or email', function () {
    // simulate a failed reset
    Password::shouldReceive('reset')
        ->once()
        ->andReturn(Password::INVALID_TOKEN); // Or Password::INVALID_USER

    // Simulate the request with invalid data
    $response = $this->postJson('/reset-password', [
        'token' => 'invalid-token',
        'email' => 'nonexistent@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    // validation exception is thrown for the email field
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});


it('requires a token for password reset', function () {
    $response = $this->postJson('/reset-password', [
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['token']);
});


it('requires an email for password reset', function () {
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-token',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});


it('requires a valid email format for password reset', function () {
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-token',
        'email' => 'invalid-email',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});


it('requires a password for password reset', function () {
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-token',
        'email' => 'test@example.com',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['password']);
});


it('requires password confirmation to match', function () {
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-token',
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'mismatched-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['password']);
});

// Test for password strength (using Rules\Password::defaults())
it('requires a strong password based on default rules', function () {
    $response = $this->postJson('/reset-password', [
        'token' => 'valid-token',
        'email' => 'test@example.com',
        'password' => 'weak', // Likely fails default rules
        'password_confirmation' => 'weak',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['password']);
});