<?php

use App\Models\User;
use App\Models\Grid;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;

/**
 * ------------------------------
 * Model factories (detached / in-memory)
 * ------------------------------
 */

/** Create a non-persisted User model for unit tests or policies */
function makeUser(int $id, UserRole $role = UserRole::User): User
{
    $user = new User();
    $user->id = $id;
    $user->role = $role;
    return $user;
}

/** Create a non-persisted Grid model linked to a user */
function makeGrid(int $userId): Grid
{
    $grid = new Grid();
    $grid->user_id = $userId;
    return $grid;
}

/**
 * ------------------------------
 * Model factories (persisted / DB)
 * ------------------------------
 */

/** Create and persist a User */
function createUser(array $attributes = []): User {
    return User::factory()->create($attributes);
}

/** Create and persist multiple Grids for a given User */
function createGrids(User $user, int $count = 3) {
    return Grid::factory()->count($count)->for($user)->create();
}

/** Create and persist a User with a hashed password */
function createUserWithPassword(string $password = 'password123', array $attributes = []): User {
    return \App\Models\User::factory()->create(array_merge([
        'password' => bcrypt($password),
        'email' => fake()->unique()->safeEmail(), // <--- hier
    ], $attributes));
}