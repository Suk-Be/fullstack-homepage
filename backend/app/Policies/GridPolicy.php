<?php

namespace App\Policies;

use App\Models\Grid;
use App\Models\User;

class GridPolicy
{
    /**
     * Determine whether the user can view any models.
     * Jeder eingeloggte User darf seine eigenen Grids auflisten.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Prüfen, ob der User dieses Grid sehen darf.
     */
    public function view(User $user, Grid $grid): bool
    {
        return $this->isOwner($user, $grid);
    }

    /**
     * Prüfen, ob der User ein neues Grid erstellen darf.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Prüfen, ob der User dieses Grid updaten darf.
     */
    public function update(User $user, Grid $grid): bool
    {
        return $this->isOwner($user, $grid);
    }

    /**
     * Prüfen, ob der User dieses Grid löschen darf.
     */
    public function delete(User $user, Grid $grid): bool
    {
        return $this->isOwner($user, $grid);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Grid $grid): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
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
