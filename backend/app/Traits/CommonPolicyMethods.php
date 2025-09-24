<?php

namespace App\Traits;

use App\Models\User;
use App\Enums\UserRole;

trait CommonPolicyMethods
{
    protected function isAdmin(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    protected function isOwner(User $user, $model, string $ownerColumn = 'user_id'): bool
    {
        if ($model instanceof User) {
            return $user->id === $model->id;
        }

        return $user->id === $model->{$ownerColumn};
    }

    /**
     * Prüft ob Admin und Besitzer des Models gleich sind (z. B. für Reset Grids).
     */
    protected function isSelfAdmin(User $loggedInUser, User $targetUser): bool
    {
        return $this->isAdmin($loggedInUser) && $this->isOwner($loggedInUser, $targetUser);
    }
}