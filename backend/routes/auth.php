<?php

use App\Http\Controllers\Api\Auth\SpaAuth\AuthController;
use App\Http\Controllers\Api\Auth\SpaAuth\GithubController;
use App\Http\Controllers\Api\Auth\SpaAuth\GoogleController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Auth-Formulare, Registration/Login/Logout
Route::middleware(['web'])->group(function () {
    Route::post('/register', [AuthController::class, 'register'])
        ->name('register');

    Route::post('/login', [AuthController::class, 'login'])
        ->name('login');

    Route::post('/logout', [AuthController::class, 'logout'])
        ->middleware('auth')
        ->name('logout');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('guest')
        ->name('password.email');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('guest')
        ->name('password.update');
});

// E-Mail Verifikation
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

// SPA /me Route, prüft Sanctum Auth
Route::middleware(['web', 'auth:sanctum'])->get('/me', [AuthController::class, 'me'])->name('me');

// OAuth-Routen (stateless, optional web wenn Session nötig)
Route::middleware(['web'])
    ->prefix('api/auth')
    ->group(function () {
        Route::get('/github', [GithubController::class, 'redirect']);
        Route::get('/github/callback', [GithubController::class, 'callback']);

        Route::get('/google', [GoogleController::class, 'redirect']);
        Route::get('/google/callback', [GoogleController::class, 'callback']);
    });