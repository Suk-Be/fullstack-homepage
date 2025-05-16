<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function login(Request $request): Response
    { {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate(); // REGENERATE SESSION ID

                // return response()->json(['user' => Auth::user()]);
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

        // $request->user()->currentAccessToken()->delete();

        return response('Successfully logged out!');
    }
}
