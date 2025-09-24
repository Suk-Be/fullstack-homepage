<?php

use App\Models\User;
use App\Models\Grid;
use App\Enums\UserRole;

/**
 * Erstellt einen User ohne DB.
 */
function makeUser(int $id, UserRole $role = UserRole::User): User
{
    $user = new User();
    $user->id = $id;
    $user->role = $role;
    return $user;
}

/**
 * Erstellt ein Grid ohne DB.
 */
function makeGrid(int $userId): Grid
{
    $grid = new Grid();
    $grid->user_id = $userId;
    return $grid;
}
