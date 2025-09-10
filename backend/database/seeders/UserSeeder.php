<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'test@test.de',
            'role' => 'admin',
            'password' => bcrypt('test@test.de'),
        ]);
    }
}
