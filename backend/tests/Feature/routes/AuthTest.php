<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// -------------------------------------------------
// Register & Login Input Validation (Web / JSON)
// -------------------------------------------------
it('validates input for register and login routes', function () {
    // Leere Eingaben => ValidationErrors
    $response = $this->postJson('/register', []);
    assertJsonValidationError($response, ['name','email','password']);

    $response = $this->postJson('/login', []);
    assertJsonValidationError($response, ['email','password']);
});

// -------------------------------------------------
// Authenticated user can access /me (JSON response)
// -------------------------------------------------
it('allows authenticated user to access /me', function () {
    $user = loginWebUser(); // Session-basiert

    $this->getJson('/me')
         ->assertOk()
         ->assertJsonFragment([
             'id' => $user->id,
             'email' => $user->email,
         ]);
});

// -------------------------------------------------
// Logout requires authentication (Web / JSON)
// -------------------------------------------------
it('requires authentication for logout', function () {
    $response = $this->post('/logout');
    $response->assertRedirect();
});

// -------------------------------------------------
// Authenticated user can logout (Web Guard)
// -------------------------------------------------
it('allows authenticated user to logout (Web)', function () {
    $user = loginWebUser();
    // actingAssimuliert session
    $this->actingAs($user, 'web');

    $response = $this->post('/logout');

    $response->assertOk()
             ->assertJsonFragment([
                 'message' => 'Sie haben sich erfolgreich abgemeldet.'
             ]);

    // Zugriff auf die Session des Test-Clients zu
    expect(session()->all())->not()->toHaveKey('login_web');
});

// -------------------------------------------------
// Password reset routes (Web, guest middleware)
// -------------------------------------------------
it('password reset routes are accessible', function () {
    $this->post('/forgot-password', [])->assertStatus(302); // redirect
    $this->post('/reset-password', [])->assertStatus(302);  // redirect
});

// -------------------------------------------------
// OAuth redirects
// -------------------------------------------------
it('redirects correctly for GitHub and Google OAuth', function () {
    $this->get('/api/auth/github')->assertRedirectContains('github.com/login/oauth');
    $this->get('/api/auth/google')->assertRedirect();
});