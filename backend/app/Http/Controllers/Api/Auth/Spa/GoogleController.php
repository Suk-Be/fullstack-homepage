<?php

namespace App\Http\Controllers\Api\Auth\Spa;

class GoogleController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'google';
    }
}
