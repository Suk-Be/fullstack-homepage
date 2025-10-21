<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

uses(Tests\TestCase::class, RefreshDatabase::class)->in('Feature');

// Unit-Tests sollen leicht bleiben
uses(Tests\UnitTestCase::class)->in('Unit');


/*
|--------------------------------------------------------------------------
| Global Helpers
|--------------------------------------------------------------------------
|
| Lädt automatisch alle PHP-Dateien im tests/Helpers-Verzeichnis.
| So musst du beim Hinzufügen neuer Helper nichts mehr anpassen.
|
*/

foreach (glob(__DIR__ . '/Helpers/*.php') as $helperFile) {
    require_once $helperFile;
}