<?php

return [
    'secret' => env('RECAPTCHA_SECRET_KEY'),
    'score_threshold' => env('RECAPTCHA_SCORE_THRESHOLD', 0.5),
];