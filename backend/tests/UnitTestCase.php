<?php

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

/**
 * Basis für echte Unit-Tests (ohne Laravel Bootstrapping oder DB)
 */
abstract class UnitTestCase extends BaseTestCase
{
    protected \Faker\Generator $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->faker = \Faker\Factory::create();
    }
}