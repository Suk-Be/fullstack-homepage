<?php

namespace App\Policies;

use App\Models\Grid;
use App\Models\User;
use App\Enums\UserRole;
use App\Traits\CommonPolicyMethods;

class GridPolicy
{
    use CommonPolicyMethods;
    /**
     * Ein User darf sein eigenes Grid sehen (Admin darf alle).
     */
    public function view(User $user, Grid $grid): bool
    {
        return $this->isAdmin($user) ||  $this->isOwner($user, $grid);
    }

    /**
     * Ein User darf sein eigenes Grid aktualisieren (Admin darf alle).
     */
    public function update(User $user, Grid $grid): bool
    {
        return $this->isAdmin($user) || $this->isOwner($user, $grid);
    }

    /**
     * Ein User darf sein eigenes Grid löschen (Admin darf alle).
     */
    public function delete(User $user, Grid $grid): bool
    {
        return $this->isAdmin($user) || $this->isOwner($user, $grid);
    }

    /**
     * Admin darf nur seine eigenen Grids zurücksetzen.
     */
    public function reset(User $loggedInUser, User $userToReset): bool
    {
        return $this->isSelfAdmin($loggedInUser, $userToReset);
    }
}