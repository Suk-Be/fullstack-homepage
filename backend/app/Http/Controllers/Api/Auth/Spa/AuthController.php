<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Response;
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
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Logs in in the user after registration
        Auth::login($user);

        return response()->json(['user' => $user]);
    }
    public function login(Request $request): Response
    { {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate(); // REGENERATE SESSION ID

                return response('User logged successfully', 200);
            }

            throw ValidationException::withMessages([
                'email' => __('The provided credentials do not match our records.'),
            ]);
        }
    }

    public function logout(Request $request): Response
    {
        Auth::logout(); // For session-based authentication

        return response('Successfully logged out!');
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
