<?php

use App\Models\User;

/**
 * ------------------------------
 * Authentication / Session helpers
 * ------------------------------
 */

/** Log in a user for session-based tests (creates one if null) */
function loginUser(?User $user = null, bool $login = true): User {
    $user ??= createUser();

    if ($login) {
        test()->actingAsSessionUser($user);
    }

    return $user;
}

/** Log in a user for API tests (sanctum) */
function loginApiUser(array $attributes = []): User {
    $user = createUser($attributes);
    test()->actingAs($user, 'sanctum');
    return $user;
}

/** Log in a user for session/web tests */
function loginWebUser(array $attributes = []): User {
    $user = createUser($attributes);
    test()->actingAs($user, 'web');
    return $user;
}

/** Assert that a route requires authentication for API routes */
function assertRequiresApiAuth(callable $callback): void {
    $response = $callback();
    $response->assertUnauthorized();
}

/** Assert that a route requires authentication for web routes */
function assertRequiresWebAuth(callable $callback): void {
    $response = $callback();
    $response->assertStatus(401); // JSON API Unauthorized
}

function assertLoggedIn(?User $user = null, string $guard = 'web'): void {
    expect(auth()->guard($guard)->check())->toBeTrue();
    if ($user) {
        expect(auth()->guard($guard)->user()->id)->toBe($user->id);
    }
}

function assertLoggedOut(string $guard = 'web'): void {
    expect(auth()->guard($guard)->check())->toBeFalse();
}