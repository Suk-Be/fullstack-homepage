<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UserPolicy;
use PHPUnit\Framework\TestCase;

class UserPolicyTest extends TestCase
{
    /**
     * @var UserPolicy
     */
    protected $policy;

    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new UserPolicy();
    }

    /**
     * Test the viewAny policy method.
     *
     * @return void
     */
    public function test_viewAny_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $this->assertFalse($this->policy->viewAny($user));
    }

    /**
     * Test the view policy method.
     *
     * @return void
     */
    public function test_view_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $model = $this->createMock(User::class);
        $this->assertFalse($this->policy->view($user, $model));
    }

    /**
     * Test the create policy method.
     *
     * @return void
     */
    public function test_create_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $this->assertFalse($this->policy->create($user));
    }

    /**
     * Test the update policy method.
     *
     * @return void
     */
    public function test_update_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $model = $this->createMock(User::class);
        $this->assertFalse($this->policy->update($user, $model));
    }

    /**
     * Test the delete policy method.
     *
     * @return void
     */
    public function test_delete_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $model = $this->createMock(User::class);
        $this->assertFalse($this->policy->delete($user, $model));
    }

    /**
     * Test the restore policy method.
     *
     * @return void
     */
    public function test_restore_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $model = $this->createMock(User::class);
        $this->assertFalse($this->policy->restore($user, $model));
    }

    /**
     * Test the forceDelete policy method.
     *
     * @return void
     */
    public function test_forceDelete_policy_returns_false()
    {
        $user = $this->createMock(User::class);
        $model = $this->createMock(User::class);
        $this->assertFalse($this->policy->forceDelete($user, $model));
    }

    /**
     * Test that an admin can reset their own grid.
     *
     * @return void
     */
    public function test_admin_can_reset_own_grid()
    {
        // Erstelle einen Mock-User für den eingeloggten Benutzer.
        $loggedInUser = $this->createMock(User::class);
        $loggedInUser->id = 1;
        $loggedInUser->role = 'admin';

        // Erstelle einen Mock-User für den zu zurücksetzenden Benutzer.
        $userToReset = $this->createMock(User::class);
        $userToReset->id = 1;

        // PHPUnit-Mock-Objekte brauchen eine Anweisung, wie sie auf Eigenschaftszugriffe
        // reagieren sollen. Hier wird ein Callback verwendet.
        $this->mockUserProperties($loggedInUser, ['id' => 1, 'role' => 'admin']);
        $this->mockUserProperties($userToReset, ['id' => 1]);

        // Führe den Policy-Test aus.
        $this->assertTrue($this->policy->reset($loggedInUser, $userToReset));
    }

    /**
     * Hilfsmethode, um Mock-User-Eigenschaften zu setzen.
     * Dies ist eine saubere Methode, um das Verhalten wiederzuverwenden.
     *
     * @param \PHPUnit\Framework\MockObject\MockObject|User $mock
     * @param array $properties
     * @return void
     */
    protected function mockUserProperties($mock, array $properties)
    {
        $mock->expects($this->any())
             ->method('__get')
             ->willReturnCallback(function ($key) use ($properties) {
                 return $properties[$key] ?? null;
             });
    }

    /**
     * Test that an admin cannot reset another user's grid.
     *
     * @return void
     */
    public function test_admin_cannot_reset_another_users_grid()
    {
        $loggedInUser = $this->createMock(User::class);
        $loggedInUser->id = 1;
        $loggedInUser->role = 'admin';

        $userToReset = $this->createMock(User::class);
        $userToReset->id = 2;

        $this->assertFalse($this->policy->reset($loggedInUser, $userToReset));
    }

    /**
     * Test that a non-admin user cannot reset their own grid.
     *
     * @return void
     */
    public function test_non_admin_cannot_reset_own_grid()
    {
        $loggedInUser = $this->createMock(User::class);
        $loggedInUser->id = 1;
        $loggedInUser->role = 'user'; // Not an admin

        $userToReset = $this->createMock(User::class);
        $userToReset->id = 1;

        $this->assertFalse($this->policy->reset($loggedInUser, $userToReset));
    }

    /**
     * Test that a non-admin user cannot reset any grid.
     *
     * @return void
     */
    public function test_non_admin_cannot_reset_any_grid()
    {
        $loggedInUser = $this->createMock(User::class);
        $loggedInUser->id = 1;
        $loggedInUser->role = 'user';

        $userToReset = $this->createMock(User::class);
        $userToReset->id = 2;

        $this->assertFalse($this->policy->reset($loggedInUser, $userToReset));
    }
}
