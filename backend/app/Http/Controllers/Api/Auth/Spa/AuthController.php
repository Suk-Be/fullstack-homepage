<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    { {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials)) {
                # todo regenerate session analyze the need for regenerating sessions
                // $request->session()->regenerate();

                return response()->json(['message' => __('Welcome!')]);
            }

            throw ValidationException::withMessages([
                'email' => __('The provided credentials do not match our records.'),
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout(); // For session-based authentication

        // $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out!',
        ]);
    }
}
