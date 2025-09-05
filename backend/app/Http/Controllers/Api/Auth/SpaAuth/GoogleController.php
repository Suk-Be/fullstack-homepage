<?php

namespace App\Http\Controllers\Api\Auth\SpaAuth;

class GoogleController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'google';
    }
}
