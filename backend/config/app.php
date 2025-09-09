<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Client Logging Configuration
    |--------------------------------------------------------------------------
    |
    | Dieser Abschnitt konfiguriert das Logging von Fehlern, die im Browser
    | bzw. auf dem Client auftreten. Das Ziel ist es, Client-Fehler
    | zentral zu sammeln, damit sie von Entwicklern eingesehen und analysiert
    | werden können.
    |
    | Ablauf:
    | 1. Das Frontend fängt Fehler ab (z.B. JS-Exceptions, API-Fehler).
    | 2. Fehler werden per POST an den Endpoint `/api/log-client-error` gesendet.
    | 3. Der Server prüft optional ein Secret (CLIENT_LOG_SECRET) zur Absicherung.
    | 4. Fehler werden in einem separaten Log-Channel `client` gespeichert
    |    unter `storage/logs/client.log`.
    |
    | Konfiguration:
    | - `client_log_secret`:
    |     Ein geheimer Schlüssel, der vom Frontend als Header gesendet wird,
    |     um sicherzustellen, dass nur autorisierte Clients Logs posten dürfen.
    |     Wert aus `.env`:
    |         CLIENT_LOG_SECRET=foobar123
    |
    | Beispiel Header im Frontend:
    |     'X-Client-Secret': import.meta.env.VITE_CLIENT_LOG_SECRET
    |
    | Log-Channel `client`:
    | - In `config/logging.php` definiert:
    |     'client' => [
    |         'driver' => 'single',
    |         'path' => storage_path('logs/client.log'),
    |         'level' => 'info',
    |     ],
    |
    | Optional kann man den Channel auf 'daily' umstellen, um
    | die Logs automatisch nach Datum zu trennen.
    |
    | Sicherheit:
    | - Throttling über Middleware 'throttle:20,1', um Spam zu verhindern.
    | - Secret-Header (`X-Client-Secret`) schützt vor unerlaubten Zugriffen.
    |
    | Nutzung in Production:
    | - Logs können per SSH (tail -f storage/logs/client.log) gelesen werden.
    | - Für größere Anwendungen empfiehlt sich ein externes Log-Management Tool.
    |
    */
    'client_log_secret' => env('CLIENT_LOG_SECRET', 'default-secret'),
];
