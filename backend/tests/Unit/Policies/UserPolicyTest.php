<?php

use App\Policies\UserPolicy;
use App\Enums\UserRole;
// makeUser ist global eingebunden, siehe Pest.php für Einbindung

beforeEach(function () {
    $this->policy = new UserPolicy();
});

it('allows admin to reset own grids', function () {
    $admin = makeUser(1, UserRole::Admin);

    expect($this->policy->reset($admin, $admin))->toBeTrue();
});

it('denies admin to reset another user grids', function () {
    $admin = makeUser(1, UserRole::Admin);
    $otherUser = makeUser(2, UserRole::User);

    expect($this->policy->reset($admin, $otherUser))->toBeFalse();
});

it('denies non-admin to reset own grids', function () {
    $user = makeUser(2, UserRole::User);

    expect($this->policy->reset($user, $user))->toBeFalse();
});

it('denies non-admin to reset another users grids', function () {
    $user = makeUser(2, UserRole::User);
    $otherUser = makeUser(3, UserRole::User);

    expect($this->policy->reset($user, $otherUser))->toBeFalse();
});