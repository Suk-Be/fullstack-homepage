<?php

use App\Models\User;
use App\Policies\UserPolicy;

beforeEach(function () {
    $this->policy = new UserPolicy();
});

/**
 * Hilfsmethode, um Mock-User-Eigenschaften zu setzen.
 */
function mockUserProperties($mock, array $properties)
{
    $mock->expects($GLOBALS['test']->any())
         ->method('__get')
         ->willReturnCallback(fn($key) => $properties[$key] ?? null);
}

it('denies viewAny for any user', function () {
    $user = $this->createMock(User::class);
    expect($this->policy->viewAny($user))->toBeFalse();
});

it('denies view for any user', function () {
    $user = $this->createMock(User::class);
    $model = $this->createMock(User::class);
    expect($this->policy->view($user, $model))->toBeFalse();
});

it('denies create for any user', function () {
    $user = $this->createMock(User::class);
    expect($this->policy->create($user))->toBeFalse();
});

it('denies update for any user', function () {
    $user = $this->createMock(User::class);
    $model = $this->createMock(User::class);
    expect($this->policy->update($user, $model))->toBeFalse();
});

it('denies delete for any user', function () {
    $user = $this->createMock(User::class);
    $model = $this->createMock(User::class);
    expect($this->policy->delete($user, $model))->toBeFalse();
});

it('denies restore for any user', function () {
    $user = $this->createMock(User::class);
    $model = $this->createMock(User::class);
    expect($this->policy->restore($user, $model))->toBeFalse();
});

it('denies forceDelete for any user', function () {
    $user = $this->createMock(User::class);
    $model = $this->createMock(User::class);
    expect($this->policy->forceDelete($user, $model))->toBeFalse();
});

it('allows admin to reset own grid', function () {
    $loggedInUser = new User(['id' => 1, 'role' => 'admin']);
    $userToReset = new User(['id' => 1]);

    $policy = new \App\Policies\UserPolicy();

    expect($policy->reset($loggedInUser, $userToReset))->toBeTrue();
});

it('denies admin to reset another user\'s grid', function () {
    $loggedInUser = new User();
    $loggedInUser->id = 1;
    $loggedInUser->role = 'admin';

    $userToReset = new User();
    $userToReset->id = 2;

    $policy = new \App\Policies\UserPolicy();

    expect($policy->reset($loggedInUser, $userToReset))->toBeFalse();
});


it('denies non-admin to reset own grid', function () {
    $loggedInUser = new User(['id' => 2, 'role' => 'user']);
    $userToReset = new User(['id' => 2]);

    $policy = new \App\Policies\UserPolicy();

    expect($policy->reset($loggedInUser, $userToReset))->toBeFalse();
});

it('denies non-admin to reset any grid', function () {
    $loggedInUser = new User(['id' => 2, 'role' => 'user']);
    $userToReset = new User(['id' => 2]);

    $policy = new \App\Policies\UserPolicy();

    expect($policy->reset($loggedInUser, $userToReset))->toBeFalse();
});
