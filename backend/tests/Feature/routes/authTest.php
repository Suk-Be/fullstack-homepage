<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function register_and_login_routes_validate_input()
    {
        $this->post('/register', [])
            ->assertStatus(422);

        $this->post('/login', [])
            ->assertStatus(422);
    }

    public function authenticated_user_can_access_me_route()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->get('/me')
            ->assertOk()
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function logout_requires_authentication()
    {
        $this->post('/logout')->assertStatus(302); // redirect to login (web guard)

        $user = User::factory()->create();
        $this->actingAs($user, 'web')
            ->post('/logout')
            ->assertRedirect(); // normal web logout redirect
    }

    public function password_reset_routes_are_accessible()
    {
        $this->post('/forgot-password', [])->assertStatus(302); // redirect with errors
        $this->post('/reset-password', [])->assertStatus(302);
    }

    public function github_and_google_redirects_work()
    {
        $this->get('/api/auth/github')->assertRedirectContains('https://github.com/login/oauth');
        $this->get('/api/auth/google')->assertRedirect(); // Google OAuth Redirect
    }
}
