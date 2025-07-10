<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

# not in use
# commented out in bootstrap/app.php in
// handled by frontend if registered renderings do not allow to login or register unless logged out

class AlreadyAuthenticatedException extends Exception
{
    public function render(): JsonResponse
    {
        return response()->json(['message' => __('Bereits authentifiziert')], 403);
    }
}