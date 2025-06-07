<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    /**
     * Authenticate a user via Sanctum for testing.
     *
     * @param \App\Models\User|null $user
     * @return \App\Models\User
     */
    protected function actingAsSanctumUser($user = null)
    {
        $user = $user ?? \App\Models\User::factory()->create();

        Sanctum::actingAs($user);

        return $user;
    }

    /**
     * Authenticate a user using session-based login (for SPA).
     *
     * @param \App\Models\User|null $user
     * @return \App\Models\User
     */
    protected function actingAsSessionUser($user = null)
    {
        $user = $user ?? \App\Models\User::factory()->create();

        $this->actingAs($user);

        return $user;
    }
}
