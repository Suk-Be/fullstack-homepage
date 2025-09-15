<?php

namespace App\Policies;

use App\Models\Grid;
use App\Models\User;
use App\Enums\UserRole;

class GridPolicy
{
    /**
     * jeder eingeloggte User darf seine eigenen Grids auflisten.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * nur der Besitzer darf, außer der User ist admin → dann darf er alles
     */
    public function view(User $user, Grid $grid): bool
    {
        return $this->isOwner($user, $grid);
    }

    /**
     * jeder eingeloggte User darf seine eigenen Grids erstellen.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * nur der Besitzer darf, außer der User ist admin → dann darf er alles
     */
    public function update(User $user, Grid $grid): bool
    {
        return $this->isOwner($user, $grid);
    }

    /**
     * nur der Besitzer darf, außer der User ist admin → dann darf er alles
     */
    public function delete(User $user, Grid $grid): bool
    {
        // Admin darf alles löschen
        if ($user->role === UserRole::Admin) {
            return true;
        }

        // Normale User nur eigene Grids
        return $this->isOwner($user, $grid);
    }

    /**
     * nur admin darf das machen.
     */
    public function reset(User $loggedInUser, User $userToReset): bool
    {
        return $loggedInUser->role === UserRole::Admin && $loggedInUser->id === $userToReset->id;
    }

    /**
     * deaktiviert
     */
    public function restore(User $user, Grid $grid): bool
    {
        return false;
    }

    /**
     * deaktiviert
     */
    public function forceDelete(User $user, Grid $grid): bool
    {
        return false;
    }

    /**
     * Checks if the user is the owner of the grid.
     */
    private function isOwner(User $user, Grid $grid): bool
    {
        return $user->id === $grid->user_id;
    }
}
