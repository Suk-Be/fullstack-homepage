<?php

namespace App\Http\Controllers\Api\Auth\SpaAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;

abstract class BaseSocialiteController extends Controller
{
    abstract protected function provider(): string;

    protected function redirectUrl(): string
    {
        return Socialite::driver($this->provider())->stateless()->redirect()->getTargetUrl();
    }

    protected function getUserFromProvider()
    {
        return Socialite::driver($this->provider())->stateless()->user();
    }

    public function redirect(): RedirectResponse
    {
        return redirect($this->redirectUrl());
    }

    public function callback(Request $request)
    {
        if ($request->has('error')) {
            return redirect('/')->with('error', 'You did not authorize the app.');
        }

        $providerUser = $this->getUserFromProvider();

        $user = User::firstOrCreate(
            ['email' => $providerUser->getEmail()],
            [
                'name' => $providerUser->getName() ?? $providerUser->getNickname(),
                'password' => bcrypt(uniqid()), // Placeholder password
            ]
        );

        Auth::login($user);

        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $callbackUrl = $frontendUrl . '/auth/callback?logged_in=true';

        return redirect()->away($callbackUrl);
    }
}