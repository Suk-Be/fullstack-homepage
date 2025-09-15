<?php

use App\Models\User;
use App\Enums\UserRole;

// Alle Tests bootstrappen die Laravel-App und nutzen RefreshDatabase
uses(Tests\TestCase::class)
    ->beforeEach(function () {
        $this->artisan('migrate');
    })
    ->in('Unit/factories');

it('creates a default user without DB', function () {
    $user = new User([
        'role' => UserRole::User,
        'name' => 'Test',
        'email' => 'test@example.com',
    ]);

    expect($user->role)->toBe(UserRole::User);
});

it('creates an admin user via state (in-memory)', function () {
    $admin = new User([
        'role' => UserRole::Admin,
        'name' => 'Test',
        'email' => 'test@example.com',
    ]);

    expect($admin->role)->toBe(UserRole::Admin);
});

it('creates a default user in database', function () {
    $user = new User([
        'role' => UserRole::User,
        'name' => 'Test',
        'email' => 'test@example.com',
    ]);

    expect($user->role)->toBe(UserRole::User);
});

it('creates an admin user in database via state', function () {
    $admin = new User([
        'role' => UserRole::Admin,
        'name' => 'Test',
        'email' => 'test@example.com',
    ]);

    expect($admin->role)->toBe(UserRole::Admin);
});
