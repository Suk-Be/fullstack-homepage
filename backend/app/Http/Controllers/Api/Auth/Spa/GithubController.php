<?php

namespace App\Http\Controllers\Api\Auth\Spa;

class GithubController extends BaseSocialiteController
{
    protected function provider(): string
    {
        return 'github';
    }
}
