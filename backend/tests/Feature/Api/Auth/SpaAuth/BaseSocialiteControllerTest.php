<?php

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
// mockSocialiteUser, createUser()

beforeEach(function () {
    // simulate Sanctum SPA session
    $this->actingAsSessionUser(createUser());
});

afterEach(function () {
    Mockery::close();
});

it('redirects to GitHub for authentication', function () {
    $response = $this->get('/api/auth/github');

    $response->assertRedirect()
             ->assertRedirectContains('github.com/login/oauth');
});

it('redirects to Google cloud for authentication', function () {
    $response = $this->get('/api/auth/google');
    $response->assertRedirect()
             ->assertRedirectContains('accounts.google.com/o/oauth2');
});


it('logs in existing user after OAuth callback', function () {
    $mockUser = mockSocialiteUser([
        'getEmail' => 'mockuser@example.com',
        'getName' => 'Mock User',
    ]);

    Socialite::shouldReceive('driver->stateless->user')->andReturn($mockUser);

    $response = $this->get('/api/auth/github/callback');

    $response->assertRedirectContains('/auth/callback?logged_in=true');
    $this->assertAuthenticatedAs(User::where('email', 'mockuser@example.com')->first());
    $this->assertDatabaseHas('users', ['email' => 'mockuser@example.com']);
});

it('creates and logs in new user after OAuth callback', function () {
    $mockUser = mockSocialiteUser([
        'getId' => '987654',
        'getEmail' => 'newuser@example.com',
        'getName' => 'New User',
        'getNickname' => 'newbie',
        'getAvatar' => 'https://avatar.url/avatar_new.png',
    ]);

    $mockProvider = Mockery::mock(\Laravel\Socialite\Two\GithubProvider::class);
    $mockProvider->shouldReceive('stateless')->andReturnSelf();
    $mockProvider->shouldReceive('user')->andReturn($mockUser);

    Socialite::shouldReceive('driver')
        ->with('github')
        ->andReturn($mockProvider);

    $response = $this->get('/api/auth/github/callback');

    $response->assertRedirectContains('/auth/callback?logged_in=true');
    $this->assertAuthenticatedAs(User::where('email', 'newuser@example.com')->first());
    $this->assertDatabaseHas('users', [
        'email' => 'newuser@example.com',
        'name'  => 'New User',
    ]);
});

it('redirects to login with error on OAuth denial', function () {
    $response = $this->get('/api/auth/github/callback?error=access_denied');

    $response->assertRedirect('/')
             ->assertSessionHas('error', 'You did not authorize the app.');
});