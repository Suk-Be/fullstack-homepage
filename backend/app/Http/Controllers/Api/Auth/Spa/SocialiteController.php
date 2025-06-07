<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;


class SocialiteController extends Controller
{
    public function redirectToGithub(): RedirectResponse
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    public function handleGithubCallback(Request $request)
    {
        if ($request->has('error')) {
            return redirect('/')->with('error', 'You did not authorize the app.');
        }

        $githubUser = Socialite::driver('github')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $githubUser->getEmail()],
            [
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'password' => bcrypt(uniqid()), // placeholder
            ]
        );

        Auth::login($user); // session-based login
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?logged_in=true');
    }
}
