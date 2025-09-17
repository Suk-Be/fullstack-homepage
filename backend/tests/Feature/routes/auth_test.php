<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

// -------------------------------------------------
// Register & Login Input Validation
// -------------------------------------------------
it('validates input for register and login routes', function () {
    $this->post('/register', [])->assertStatus(422);
    $this->post('/login', [])->assertStatus(422);
});

// -------------------------------------------------
// Authenticated user can access /me
// -------------------------------------------------
it('allows authenticated user to access /me', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
         ->get('/me')
         ->assertOk()
         ->assertJson([
             'id' => $user->id,
             'email' => $user->email,
         ]);
});

// -------------------------------------------------
// Logout requires authentication
// -------------------------------------------------
it('requires authentication for logout', function () {
    $this->post('/logout')->assertStatus(302); // redirect to login

    $user = User::factory()->create();
    $this->actingAs($user, 'web')
         ->post('/logout')
         ->assertRedirect(); // normal web logout redirect
});

// -------------------------------------------------
// Password reset routes
// -------------------------------------------------
it('password reset routes are accessible', function () {
    $this->post('/forgot-password', [])->assertStatus(302); // redirect with errors
    $this->post('/reset-password', [])->assertStatus(302);
});

// -------------------------------------------------
// GitHub & Google OAuth redirects
// -------------------------------------------------
it('redirects correctly for GitHub and Google OAuth', function () {
    $this->get('/api/auth/github')->assertRedirectContains('https://github.com/login/oauth');
    $this->get('/api/auth/google')->assertRedirect(); // Google OAuth redirect
});
