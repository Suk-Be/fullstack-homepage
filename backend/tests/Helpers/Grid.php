<?php

use App\Models\User;
use App\Models\Grid;
use Illuminate\Support\Str;

/**
 * ------------------------------
 * Grid helpers
 * ------------------------------
 */

/** Create multiple grids for a given user */
function createUserGrids(User $user, int $count = 1, array $overrides = []) {
    return Grid::factory()->count($count)->for($user)->create($overrides);
}

/** Generate payload for grid creation/update */
function makeGridPayload(array $overrides = []): array {
    return array_merge([
        'layoutId' => (string) Str::uuid(),
        'name' => 'Test Grid',
        'config' => ['columns' => 3],
        'timestamp' => now()->toISOString(),
    ], $overrides);
}
