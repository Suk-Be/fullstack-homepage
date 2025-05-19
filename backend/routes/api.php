<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', fn(Request $request) => $request->user());
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::prefix('auth/spa')->group(function () {
    // Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
