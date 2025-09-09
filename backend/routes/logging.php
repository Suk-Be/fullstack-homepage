<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:20,1')->post('/log-client-error', function (Request $request) {

    // Secret-Check
    if ($request->header('X-Client-Secret') !== config('app.client_log_secret')) {
        abort(403, 'Unauthorized');
    }

    $context = $request->input('context', 'No context');
    $error = $request->input('error', 'No error');
    $extra = $request->input('extra', []);
    $timestamp = $request->input('timestamp', now()->toIso8601String());

    Log::channel('client')->info('Client Error', [
        'timestamp' => $timestamp,
        'context'   => $context,
        'error'     => $error,
        'extra'     => $extra,
    ]);

    return response()->noContent();
});

