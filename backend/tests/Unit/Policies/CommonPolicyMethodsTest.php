<?php

use App\Models\User;
use App\Traits\CommonPolicyMethods;
use App\Enums\UserRole;
// makeUser ist global eingebunden, siehe Pest.php für Einbindung

beforeEach(function () {
    $this->helper = new class {
        use CommonPolicyMethods;

        public function isAdminPublic(User $user) {
            return $this->isAdmin($user);
        }

        public function isOwnerPublic(User $user, $model) {
            return $this->isOwner($user, $model);
        }

        public function isSelfAdminPublic(User $loggedInUser, User $targetUser) {
            return $this->isSelfAdmin($loggedInUser, $targetUser);
        }
    };
});

it('correctly identifies admin users', function () {
    $tests = [
        makeUser(1, UserRole::Admin),
        makeUser(2, UserRole::User),
    ];

    foreach ($tests as $user) {
        $expected = $user->role === UserRole::Admin;
        expect($this->helper->isAdminPublic($user))->toBe($expected);
    }
});

it('correctly checks ownership of models', function () {
    $user = makeUser(1);
    $other = makeUser(2);

    $gridOwned = new stdClass();
    $gridOwned->user_id = 1;

    $gridNotOwned = new stdClass();
    $gridNotOwned->user_id = 2;

    expect($this->helper->isOwnerPublic($user, $gridOwned))->toBeTrue()
        ->and($this->helper->isOwnerPublic($user, $gridNotOwned))->toBeFalse()
        ->and($this->helper->isOwnerPublic($user, $user))->toBeTrue();
});

it('correctly checks self-admin status', function () {
    $admin = makeUser(1, UserRole::Admin);
    $user = makeUser(2);

    expect($this->helper->isSelfAdminPublic($admin, $admin))->toBeTrue()
        ->and($this->helper->isSelfAdminPublic($admin, $user))->toBeFalse();
});
