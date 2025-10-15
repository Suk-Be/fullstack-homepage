<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Auth\SpaAuth\ForgotPasswordRequest;

class NewPasswordController extends Controller
{
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        $request->resetPassword();

        return response()->json([
            'status' => 'success',
            'message' => 'Passwort wurde erfolgreich zurückgesetzt!',
        ]);
    }
}