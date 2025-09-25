<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Notification;

test('reset password link can be requested', function () {
    Notification::fake();

    $user = createUser();

    $response = $this->withMiddleware()
        ->post(route('password.email'), [
            'email' => $user->email,
        ]);

    $response->assertStatus(200);

    Notification::assertSentTo($user, ResetPasswordNotification::class);
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = createUser();
    $password = 'password';

    // Trigger password reset email
    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo(
        $user,
        ResetPasswordNotification::class,
        function ($notification) use ($user, $password) {
            $response = $this->post(route('password.update'), [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => $password,
                'password_confirmation' => $password,
            ]);

            $response->assertStatus(200);
            return true;
        }
    );
});