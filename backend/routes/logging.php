<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::post('/log-client-error', function (Request $request) {
    $context = $request->input('context', 'No context');
    $error = $request->input('error', 'No error');
    $extra = $request->input('extra', []);
    $timestamp = $request->input('timestamp', now()->toIso8601String());

    // Log in separatem Channel
    Log::channel('client')->info('Client Error', [
        'timestamp' => $timestamp,
        'context' => $context,
        'error' => $error,
        'extra' => $extra,
    ]);

    return response()->noContent();
});
