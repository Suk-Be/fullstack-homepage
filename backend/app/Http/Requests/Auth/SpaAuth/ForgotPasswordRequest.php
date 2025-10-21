<?php

namespace App\Http\Requests\Auth\SpaAuth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;
use App\Rules\RecaptchaV3;
use App\Enums\RecaptchaAction;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // jeder kann eine Passwort-Reset-Anfrage stellen
    }

    public function rules(): array
    {
        $rules = [
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        if (env('RECAPTCHA_PROTECT_RESET_PASSWORD', false)) {
            $rules['recaptcha_token'] = ['required', new RecaptchaV3(RecaptchaAction::ResetPassword->value)];
        }

        return $rules;
    }

    public function resetPassword(): void
    {
        $status = Password::reset(
            $this->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) {
                $user->forceFill([
                    'password' => Hash::make($this->string('password')),
                    'remember_token' => Str::random(60),
                ])->save();

                Auth::login($user);

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
    }

}