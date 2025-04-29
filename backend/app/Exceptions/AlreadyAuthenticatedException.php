<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

# todo not in use: analyze redirect to have side effects if user already logged in (cors)
# commented out in bootstrap/app.php in
// $middleware->redirectUsersTo(function (Request $request) {
//     if ($request->expectsJson()) {
//         throw new AlreadyAuthenticatedException();
//     }

//     return '/';
// });

class AlreadyAuthenticatedException extends Exception
{
    public function render(): JsonResponse
    {
        return response()->json(['message' => __('Already Authenticated')], 403);
    }
}