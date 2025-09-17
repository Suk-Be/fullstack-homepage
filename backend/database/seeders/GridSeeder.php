<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Grid;
use Illuminate\Support\Facades\Hash;

class GridSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userData = [
            ['name' => 'Test User',  'email' => 'test@test.de'],
            ['name' => 'Test User1', 'email' => 'test1@test.de'],
            ['name' => 'Test User2', 'email' => 'test2@test.de'],
        ];

        foreach ($userData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('test@test.de'),
                ]
            );

            Grid::factory()->count(3)->create([
                'user_id' => $user->id,
            ])->each(function ($grid, $index) use ($user) {
                $grid->update(['name' => "grid_{$user->id}_{$index}"]);
            });
        }
    }
}