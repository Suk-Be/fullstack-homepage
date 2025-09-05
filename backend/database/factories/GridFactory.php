<?php

namespace Database\Factories;

use App\Models\Grid;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GridFactory extends Factory
{
    protected $model = Grid::class;

    public function definition(): array
    {
        return [
            'layout_id' => $this->faker->uuid(),
            'name' => $this->faker->words(3, true),
            'config' => [
                'items' => $this->faker->numberBetween(1, 10),
                'columns' => $this->faker->numberBetween(1, 5),
                'gap' => $this->faker->numberBetween(0, 20),
                'border' => $this->faker->numberBetween(0, 5),
                'paddingX' => $this->faker->numberBetween(0, 20),
                'paddingY' => $this->faker->numberBetween(0, 20),
            ],
            'timestamp' => now(),
            'user_id' => User::factory(),
        ];
    }
}
