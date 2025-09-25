<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Grid\GridController;

use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use App\Exceptions\AlreadyAuthenticatedException;
use App\Models\User;
use Illuminate\Http\Request;

// FYI: web session token, keine api token
Route::middleware(['auth:sanctum'])->group(function () {
    // Normale REST-Routen, die haben einen Standardnamen (z.B. grids.destroy)
    Route::apiResource('grids', GridController::class);

    Route::get('/user/grids', [GridController::class, 'index']);

    // Grid nach layout_id löschen
    Route::delete('grids/by-layout/{layoutId}', [GridController::class, 'destroyByLayout'])->name('grids.destroyByLayout');

    // Admin: darf alle seine eigenen Grids löschen
    Route::delete('users/{userId}/grids', [GridController::class, 'resetUserGrids'])->name('grids.resetUserGrids');
});

// Nur für lokale/test/dev Umgebungen
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
