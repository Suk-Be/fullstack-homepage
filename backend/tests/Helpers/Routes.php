<?php

use Illuminate\Support\Facades\Route;

/** Register a temporary route that returns JSON for testing */
function registerJsonTestRoute(string $uri, int $status = 200, array $payload = []): void {
    Route::get($uri, function () use ($status, $payload) {
        return response()->json($payload, $status);
    });
}

/** Register a temporary route that throws a given exception */
function registerTestRouteWithException(string $uri, \Throwable $exception): void {
    Route::get($uri, function () use ($exception) {
        throw $exception;
    });
}
