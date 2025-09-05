<?php

use App\Models\User;
use App\Models\Grid;
use App\Policies\GridPolicy;

beforeEach(function () {
    $this->policy = new GridPolicy();

    // Echte Models, DB nicht nötig
    $this->owner = new User();
    $this->owner->forceFill(['id' => 1]);

    $this->otherUser = new User();
    $this->otherUser->forceFill(['id' => 2]);

    $this->grid = new Grid();
    $this->grid->forceFill(['user_id' => $this->owner->id]);
});

it('allows any user to viewAny grids', function () {
    expect($this->policy->viewAny($this->owner))->toBeTrue();
    expect($this->policy->viewAny($this->otherUser))->toBeTrue();
});

it('allows the owner to view their grid', function () {
    expect($this->policy->view($this->owner, $this->grid))->toBeTrue();
});

it('denies other users from viewing the grid', function () {
    expect($this->policy->view($this->otherUser, $this->grid))->toBeFalse();
});

it('allows the owner to update their grid', function () {
    expect($this->policy->update($this->owner, $this->grid))->toBeTrue();
});

it('denies other users from updating the grid', function () {
    expect($this->policy->update($this->otherUser, $this->grid))->toBeFalse();
});

it('allows the owner to delete their grid', function () {
    expect($this->policy->delete($this->owner, $this->grid))->toBeTrue();
});

it('denies other users from deleting the grid', function () {
    expect($this->policy->delete($this->otherUser, $this->grid))->toBeFalse();
});

it('denies restore and forceDelete for all users', function () {
    expect($this->policy->restore($this->owner, $this->grid))->toBeFalse();
    expect($this->policy->forceDelete($this->owner, $this->grid))->toBeFalse();
});
