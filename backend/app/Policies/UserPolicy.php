<?php

namespace App\Policies;

use App\Models\User;
use App\Traits\CommonPolicyMethods;

class UserPolicy
{
    use CommonPolicyMethods;

    /**
     * Admin darf nur seine eigenen Grids zurücksetzen.
     */
    public function reset(User $loggedInUser, User $userToReset): bool
    {
        return $this->isSelfAdmin($loggedInUser, $userToReset);
    }
}