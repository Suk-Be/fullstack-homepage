<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Traits\Recaptcha;
use App\Enums\RecaptchaAction;

class PasswordResetLinkController extends Controller
{
    use Recaptcha;

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'recaptcha_token' => ['required', 'string'],
        ]);

        if (env('RECAPTCHA_PROTECT_RESET_PASSWORD', false)) {
            $this->verifyRecaptcha($request->recaptcha_token, RecaptchaAction::ForgotPassword->value);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['status' => __($status)]);
    }
}