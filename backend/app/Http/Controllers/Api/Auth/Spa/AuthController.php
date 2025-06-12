<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed', // <-- erwartet password_confirmation
            ],
            [
                'email.unique' => 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
            ]
        );

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        // Logs in in the user after registration
        Auth::login($user);

        return response()->json(['user' => $user]);
    }
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // REGENERATE SESSION ID

            return response()->json([
                'message' => 'Sie haben sich erfolgreich angemeldet.',
                'user' => Auth::user(),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => 'Diese E-Mail ist nicht registriert oder das Passwort ist falsch.',
        ]);

    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout(); // For session-based authentication

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sie haben sich erfolgreich abgemeldet.'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}