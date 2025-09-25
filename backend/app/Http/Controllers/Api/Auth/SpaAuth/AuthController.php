<?php

namespace App\Http\Controllers\Api\Auth\SpaAuth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use App\Exceptions\AlreadyAuthenticatedException;
use App\Traits\ApiResponses;
use App\Enums\UserRole;

class AuthController extends Controller
{
    use ApiResponses;

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ],
            [
                'email.unique' => 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
            ]
        );

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => UserRole::User,
        ]);

        Auth::login($user);

        return $this->success(['user' => new UserResource($user)], 'Sie haben sich erfolgreich registriert.');
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.',
            ]);
        }

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
