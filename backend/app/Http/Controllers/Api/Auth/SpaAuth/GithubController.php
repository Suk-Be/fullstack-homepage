<?php

namespace App\Http\Controllers\Api\Auth\SpaAuth;

class GithubController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'github';
    }
}
