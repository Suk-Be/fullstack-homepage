<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', fn(Request $request) => $request->user());
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::prefix('auth/spa')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/auth/github', [SocialiteController::class, 'redirectToGithub']);
Route::get('/auth/github/callback', [SocialiteController::class, 'handleGithubCallback']);
