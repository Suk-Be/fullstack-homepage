<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\GithubController;
use App\Http\Controllers\Api\Auth\Spa\GoogleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Sanctum-protected route: user info
Route::middleware(['auth:sanctum'])->get('/me', [AuthController::class, 'me']);

// SPA Auth routes with session support
Route::prefix('auth/spa')->middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.update');
});

// Socialite OAuth routes (stateless, no session needed)
Route::get('/auth/github', [GithubController::class, 'redirect']);
Route::get('/auth/github/callback', [GithubController::class, 'callback']);

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
