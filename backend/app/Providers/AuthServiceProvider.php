<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Grid;
use App\Models\User;
use App\Policies\GridPolicy;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    protected $policies = [
        User::class => UserPolicy::class,
        Grid::class => GridPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
