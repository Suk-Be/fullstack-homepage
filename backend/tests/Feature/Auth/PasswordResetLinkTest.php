<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Notification;
use App\Enums\RecaptchaAction;

test('reset password link can be requested', function () {
    Notification::fake();

    $user = createUser();

    $payload = withRecaptchaPayload([
        'email' => $user->email,
    ], RecaptchaAction::ResetPassword);

    $response = $this->withMiddleware()
        ->post(route('password.email'), $payload);

    $response->assertStatus(200);

    Notification::assertSentTo($user, ResetPasswordNotification::class);
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = createUser();
    $password = 'password';

    // Trigger password reset email
    $payload = withRecaptchaPayload([
        'email' => $user->email,
    ], RecaptchaAction::ResetPassword);

    $this->post(route('password.email'), $payload);

    Notification::assertSentTo(
        $user,
        ResetPasswordNotification::class,
        function ($notification) use ($user, $password) {
            $resetPayload = withRecaptchaPayload([
                'token' => $notification->token,
                'email' => $user->email,
                'password' => $password,
                'password_confirmation' => $password,
            ], RecaptchaAction::ResetPassword);

            $response = $this->post(route('password.update'), $resetPayload);

            $response->assertStatus(200);
            return true;
        }
    );
});
