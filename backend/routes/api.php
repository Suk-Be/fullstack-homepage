<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



Route::prefix('auth/spa')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
