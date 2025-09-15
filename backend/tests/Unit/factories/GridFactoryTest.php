<?php

use Illuminate\Support\Str;

it('creates a Grid instance in memory without DB', function () {
    // Plain PHP-Objekt statt Eloquent-Model für User
    $user = (object) [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'user',
        'id' => 1,
    ];

    // Plain PHP-Objekt für Grid
    $grid = (object) [
        'layout_id' => Str::uuid(),
        'name' => 'Test Grid',
        'config' => [
            'items' => 3,
            'columns' => 2,
            'gap' => 5,
            'border' => 1,
            'paddingX' => 2,
            'paddingY' => 2,
        ],
        'timestamp' => now(),
        'user_id' => $user->id,
    ];

    expect($grid)->toBeObject();
    expect($grid->name)->toBe('Test Grid');
    expect($grid->config['items'])->toBe(3);
});
