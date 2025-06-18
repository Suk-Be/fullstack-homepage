<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\GithubController;
use App\Http\Controllers\Api\Auth\Spa\GoogleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetLinkController; // Importieren Sie den PasswordController
use App\Http\Controllers\Auth\NewPasswordController;       // <-- Hinzufügen/Korrigieren
use Illuminate\Auth\Notifications\ResetPassword; // Dies ist nur für das Customizing der E-Mail, nicht direkt für Routen

// Sanctum-protected route: user info
Route::middleware(['auth:sanctum'])->get('/me', [AuthController::class, 'me']);

// SPA Auth routes with session support
Route::prefix('auth/spa')->middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // NEUE ROUTEN FÜR PASSWORT-RESET
    // Anfrage für einen Passwort-Reset-Link
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']) // <-- HIER KORRIGIERT!
        ->name('password.email');

    // Passwort zurücksetzen
    Route::post('/reset-password', [NewPasswordController::class, 'store']) // <-- HIER KORRIGIERT!
        ->name('password.update'); // Der Name 'password.store' ist auch falsch, Laravel erwartet 'password.update'
});

// Socialite OAuth routes (stateless, no session needed)
Route::get('/auth/github', [GithubController::class, 'redirect']);
Route::get('/auth/github/callback', [GithubController::class, 'callback']);

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
