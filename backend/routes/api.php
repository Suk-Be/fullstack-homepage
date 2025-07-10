<?php

use App\Http\Controllers\Api\Auth\Spa\AuthController;
use App\Http\Controllers\Api\Auth\Spa\GithubController;
use App\Http\Controllers\Api\Auth\Spa\GoogleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use App\Exceptions\AlreadyAuthenticatedException;
use App\Models\User;
use Illuminate\Http\Request;

// Sanctum-protected route: user info
Route::middleware(['auth:sanctum'])->get('/me', [AuthController::class, 'me']);

// Sanctum-protected route: SPA Auth routes with session support
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
Route::prefix('auth')->group(function () {
    Route::get('/github', [GithubController::class, 'redirect']);
    Route::get('/github/callback', [GithubController::class, 'callback']);

    Route::get('/google', [GoogleController::class, 'redirect']);
    Route::get('/google/callback', [GoogleController::class, 'callback']);
});


if (app()->environment('local', 'testing', 'development')) {
    Route::prefix('test-errors')->group(function () { // No need for middleware('api') here, it's applied by the bootstrap/app.php's overall api group.

        Route::get('/validation-exception', function (Request $request) {
            // Manually throw ValidationException with a specific message for testing
            throw ValidationException::withMessages([
                'required_field' => ['Das erforderliche Feld ist nicht da.'], // Or 'Das Pflichtfeld ist erforderlich.' if you want to test default German.
                'another_field' => ['Dies ist ein weiterer Validierungsfehler.'],
            ]);
        });

        Route::get('/custom-validation-exception', function () {
            throw ValidationException::withMessages([
                'custom_field' => 'Dies ist eine benutzerdefinierte Validierung-Fehlermeldung.',
            ]);
        });

        Route::get('/authentication-exception', function () {
            throw new AuthenticationException('Nicht authentifiziert.');
        });

        Route::get('/already-authenticated-exception', function () {
            throw new AlreadyAuthenticatedException();
        });

        Route::get('/model-not-found-exception/{id}', function ($id) {
            User::findOrFail($id);
        });

        Route::get('/not-found-http-exception', function () {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException('Route wurde nicht manuell gefunden.');
        });

        Route::post('/method-not-allowed-http-exception', function () {
            return response()->json(['message' => 'Dies ist eine POST-Route.']);
        });

        Route::get('/generic-exception', function () {
            throw new \Exception('Es ist ein unerwarteter Fehler aufgetreten.');
        });
    });
}
