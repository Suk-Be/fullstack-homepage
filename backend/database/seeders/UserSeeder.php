<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'test@test.de',
            'role' => UserRole::Admin,
            'password' => bcrypt('test@test.de'),
        ]);
    }
}
