<?php

use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Mockery;

beforeEach(function () {
    // Optional setup code here
});

it('redirects to GitHub for authentication', function () {
    $response = $this->get('/api/auth/github');
    $response->assertRedirect();
});

it('handles GitHub callback and logs in user', function () {
    $mockSocialiteUser = Mockery::mock(SocialiteUser::class);
    $mockSocialiteUser->shouldReceive('getEmail')->andReturn('mockuser@example.com');
    $mockSocialiteUser->shouldReceive('getName')->andReturn('Mock User');
    $mockSocialiteUser->shouldReceive('getNickname')->andReturn('mocknickname');

    $mockProvider = Mockery::mock(\Laravel\Socialite\Two\GithubProvider::class);
    $mockProvider->shouldReceive('stateless')->andReturnSelf();
    $mockProvider->shouldReceive('user')->andReturn($mockSocialiteUser);

    Socialite::shouldReceive('driver')
        ->with('github')
        ->andReturn($mockProvider);

    $response = $this->get('/api/auth/github/callback');

    $response->assertRedirectContains('/auth/callback?logged_in=true');
    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'email' => 'mockuser@example.com',
    ]);
});