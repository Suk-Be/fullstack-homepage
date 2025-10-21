<?php

use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use Illuminate\Support\Facades\Http;
use App\Enums\RecaptchaAction;


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


/**
 * Faked eine reCAPTCHA-v3-Validierung (für Trait & Rule kompatibel)
 */
function fakeRecaptcha(string|RecaptchaAction $action = RecaptchaAction::Register, float $score = 0.9, bool $success = true): array
{
    $actionValue = $action instanceof RecaptchaAction ? $action->value : $action;

    Http::fake([
        'https://www.google.com/recaptcha/api/siteverify' => Http::response([
            'success' => $success,
            'score'   => $score,
            'action'  => $actionValue,
        ], 200),
    ]);

    // Damit du es direkt ins Payload mergen kannst:
    return ['recaptcha_token' => 'dummy-token'];
}

/**
 * Fügt dem Payload automatisch ein gefaktes reCAPTCHA-Token hinzu.
 *
 * Beispiel:
 *   postJson('/login', withRecaptchaPayload(['email' => 'a@b.de'], RecaptchaAction::Login))
 */
function withRecaptchaPayload(array $payload, string|RecaptchaAction $action): array
{
    return $payload + fakeRecaptcha($action);
}