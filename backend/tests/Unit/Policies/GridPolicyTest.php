<?php

use App\Policies\GridPolicy;
use App\Enums\UserRole;
// makeUser ist global eingebunden, siehe Pest.php für Einbindung
// makeGrid ist global eingebunden, siehe Pest.php für Einbindung

beforeEach(function () {
    $this->policy = new GridPolicy();
});

it('allows owner to view their own grid', function () {
    $userRole = makeUser(2, UserRole::User);
    $gridUser = makeGrid($userRole->id);
    expect($this->policy->view($userRole, $gridUser))->toBeTrue();
});

it('allows admin to view any grid', function () {
    $adminRole = makeUser(1, UserRole::Admin);
    $anyRole = makeUser(3);
    $grid = makeGrid($anyRole->id);
    expect($this->policy->view($adminRole, $grid))->toBeTrue();
});

it('denies non-owner non-admin to view a grid', function () {
    $userRole = makeUser(2, UserRole::User);
    $otherUserRole = makeUser(3, UserRole::User);
    $grid = makeGrid($otherUserRole->id);

    expect($this->policy->view($userRole, $grid))->toBeFalse();
});

it('allows owner to update their own grid', function () {
    $anyRole = makeUser(3);
    $grid = makeGrid($anyRole->id);

    expect($this->policy->update($anyRole, $grid))->toBeTrue();
});

it('allows admin to update any grid', function () {
    $adminRole = makeUser(1, UserRole::Admin);
    $otherUserRole = makeUser(3, UserRole::User);
    $grid = makeGrid($otherUserRole->id);

    expect($this->policy->update($adminRole, $grid))->toBeTrue();
});

it('denies non-owner non-admin to update a grid', function () {
    $userRole = makeUser(2, UserRole::User);
    $otherUserRole = makeUser(3, UserRole::User);
    $grid = makeGrid($otherUserRole->id);

    expect($this->policy->update($userRole, $grid))->toBeFalse();
});

it('allows owner to delete their own grid', function () {
    $userRole = makeUser(2, UserRole::User);
    $grid = makeGrid($userRole->id);

    expect($this->policy->delete($userRole, $grid))->toBeTrue();
});

it('allows admin to delete any grid', function () {
    $adminRole = makeUser(1, UserRole::Admin);
    $otherUserRole = makeUser(3, UserRole::User);
    $grid = makeGrid($otherUserRole->id);

    expect($this->policy->delete($adminRole, $grid))->toBeTrue();
});

it('denies non-owner non-admin to delete a grid', function () {
    $userRole = makeUser(2, UserRole::User);
    $otherUserRole = makeUser(3, UserRole::User);
    $grid = makeGrid($otherUserRole->id);

    expect($this->policy->delete($userRole, $grid))->toBeFalse();
});

it('allows admin to reset their own grids', function () {
    $adminRole = makeUser(1, UserRole::Admin);
    expect($this->policy->reset($adminRole, $adminRole))->toBeTrue();
});

it('denies adminRole to reset another users grids', function () {
    $adminRole = makeUser(1, UserRole::Admin);
    $otherUserRole = makeUser(3, UserRole::User);
    expect($this->policy->reset($adminRole, $otherUserRole))->toBeFalse();
});

it('denies non-adminRole to reset any grids', function () {
    $user = makeUser(2, UserRole::User);
    expect($this->policy->reset($user, $user))->toBeFalse();

    $otherUserRole = makeUser(3, UserRole::User);
    expect($this->policy->reset($user, $otherUserRole))->toBeFalse();
});