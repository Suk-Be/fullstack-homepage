<?php

namespace App\Http\Controllers\Api\Auth\SpaAuth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;

use Illuminate\Http\Request;
use App\Http\Requests\Auth\SpaAuth\LoginRequest;
use App\Http\Requests\Auth\SpaAuth\RegisterRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponses;

class AuthController extends Controller
{
    use ApiResponses;

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $request->createUser();

        Auth::login($user);

        return $this->success(
            ['user' => new UserResource($user)],
            'Sie haben sich erfolgreich registriert.'
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return $this->success( ['user' => new UserResource(Auth::user())], 'Sie haben sich erfolgreich angemeldet.');

    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        // Session-Invaliderung (für Web Guard)
        $request->session()?->invalidate();
        $request->session()?->regenerateToken();

        return response()->json([
            'message' => 'Sie haben sich erfolgreich abgemeldet.'
        ]);
    }



    public function me(Request $request): JsonResponse
    {
        return $this->success(['user' => new UserResource($request->user())]);
    }

}
