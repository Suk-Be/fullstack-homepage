<?php

use Laravel\Socialite\Contracts\User as SocialiteUserContract;

/** Mock a Socialite user for OAuth login tests */
function mockSocialiteUser(array $overrides = []): SocialiteUserContract {
    $mock = Mockery::mock(SocialiteUserContract::class);
    $defaults = [
        'getId' => '123456',
        'getEmail' => 'mock@example.com',
        'getName' => 'Mock User',
        'getNickname' => 'mocknick',
        'getAvatar' => 'https://avatar.url/mock.png',
    ];

    foreach (array_merge($defaults, $overrides) as $method => $return) {
        $mock->shouldReceive($method)->andReturn($return);
    }

    return $mock;
}