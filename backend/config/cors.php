<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => [
        'api/*',          // api local
        'v1/*',           // api web server
        'api/csrf-cookie',
        'me',
        'login',
        'register',
        'logout',
        'forgot-password',
        'reset-password',
        // Optional: OAuth, falls Frontend direkt darauf zugreift
        'github',
        'github/callback',
        'google',
        'google/callback',
        'auth/*',         // google/github callbacks webserver
    ],


    'allowed_methods' => ['*'],

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
