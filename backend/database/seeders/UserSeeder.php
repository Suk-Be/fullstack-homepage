<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Beispiel-User für Tests/Dev
        User::factory()->create([
            'name' => 'Sok',
            'email' => 'sok@example.com',
            'password' => bcrypt('manager101'),
        ]);

        // weitere 5 zufällige User
        User::factory(5)->create();
    }
}
