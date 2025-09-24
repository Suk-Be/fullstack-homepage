<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    protected function success(array|object $data = [], ?string $message = null, int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => $statusCode,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    protected function error(array|string $errors, int $statusCode = 422): JsonResponse
    {
        return response()->json([
            'status' => $statusCode,
            'errors' => is_string($errors) ? ['general' => [$errors]] : $errors,
        ], $statusCode);
    }

    protected function validationError($errors, int $statusCode = 422): JsonResponse
    {
        if (method_exists($errors, 'toArray')) {
            $errors = $errors->toArray();
        }

        return $this->error($errors, $statusCode);
    }
}
