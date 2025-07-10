<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        // add custom exceptions if you don't want them logged (handled specifically),
        // for example: AlreadyAuthenticatedException::class,
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Here you can send exceptions to external error tracking services like Sentry or Bugsnag
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $e): \Symfony\Component\HttpFoundation\Response
    {
        // Only apply custom JSON handling for API requests or requests expecting JSON
        if ($request->expectsJson() || $request->is('api/*')) {

            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Die angegebenen Daten waren ungültig.',
                    'errors' => $e->errors(),
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'message' => 'Nicht authentifiziert.',
                ], 401);
            }

            if ($e instanceof AlreadyAuthenticatedException) {
                return response()->json([
                    'message' => __('Bereits authentifiziert'),
                ], 403); // 403 Forbidden is appropriate for "already authenticated"
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'message' => 'Ressource nicht gefunden.',
                ], 404);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'message' => 'Die HTTP-Methode wird für diese Route nicht unterstützt.',
                ], 405);
            }

            // For any other unexpected errors, return a generic 500
            // In production, avoid exposing $e->getMessage() for security reasons.
            return response()->json([
                'message' => 'Es ist ein unerwarteter Fehler aufgetreten.',
                // 'error' => config('app.debug') ? $e->getMessage() : 'Server Error', // Example of conditional error message
            ], 500);
        }

        // For non-API requests, use Laravel's default exception rendering
        return parent::render($request, $e);
    }
}