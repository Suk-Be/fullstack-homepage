<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\SocialiteController;
use Illuminate\Support\Facades\Route;

// Sanctum-protected route: user info
Route::middleware(['auth:sanctum'])->get('/me', [AuthController::class, 'me']);

// SPA Auth routes with session support
Route::prefix('auth/spa')->middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Socialite OAuth routes (stateless, no session needed)
Route::get('/auth/github', [SocialiteController::class, 'redirectToGithub']);
Route::get('/auth/github/callback', [SocialiteController::class, 'handleGithubCallback']);
