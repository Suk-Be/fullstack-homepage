<?php

use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use App\Models\User;

beforeEach(function () {
    // To mimic Sanctum SPA authentication cookies properly
    $user = User::factory()->create();
    $this->actingAsSessionUser($user);
});

afterEach(function () {
    Mockery::close();
});

it('redirects to GitHub for authentication', function () {
    $response = $this->get('/api/auth/github');
    $response->assertRedirect();
    $response->assertRedirectContains('github.com/login/oauth');
});

it('logs in existing user after OAuth callback', function () {
    $mockSocialiteUser = Mockery::mock(SocialiteUserContract::class);
    $mockSocialiteUser->shouldReceive('getEmail')->andReturn('mockuser@example.com');
    $mockSocialiteUser->shouldReceive('getName')->andReturn('Mock User');
    $mockSocialiteUser->shouldReceive('getNickname')->andReturn('mocknickname');
    $mockSocialiteUser->shouldReceive('getAvatar')->andReturn('https://avatar.url/avatar.png');

    Socialite::shouldReceive('driver->stateless->user')->andReturn($mockSocialiteUser);

    $response = $this->get('/api/auth/github/callback');

    $response->assertRedirectContains('/auth/callback?logged_in=true');
    $this->assertAuthenticatedAs(User::where('email', 'mockuser@example.com')->first());
    $this->assertDatabaseHas('users', [
        'email' => 'mockuser@example.com',
    ]);
});

it('creates and logs in new user after OAuth callback', function () {
    $socialiteUser = Mockery::mock(SocialiteUserContract::class);
    $socialiteUser->shouldReceive('getId')->andReturn('987654');
    $socialiteUser->shouldReceive('getEmail')->andReturn('newuser@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('New User');
    $socialiteUser->shouldReceive('getNickname')->andReturn('newbie');
    $socialiteUser->shouldReceive('getAvatar')->andReturn('https://avatar.url/avatar_new.png');

    $mockProvider = Mockery::mock(\Laravel\Socialite\Two\GithubProvider::class);
    $mockProvider->shouldReceive('stateless')->andReturnSelf();
    $mockProvider->shouldReceive('user')->andReturn($socialiteUser);

    Socialite::shouldReceive('driver')
        ->with('github')
        ->andReturn($mockProvider);

    $response = $this->get('/api/auth/github/callback');

    $response->assertRedirectContains('/auth/callback?logged_in=true');
    $this->assertAuthenticatedAs(User::where('email', 'newuser@example.com')->first());
    $this->assertDatabaseHas('users', [
        'email' => 'newuser@example.com',
        'name' => 'New User',
    ]);
});

it('redirects to login with error on OAuth denial', function () {
    $response = $this->get('/api/auth/github/callback?error=access_denied');

    $response->assertRedirect('/');
    $response->assertSessionHas('error', 'You did not authorize the app.');
});
