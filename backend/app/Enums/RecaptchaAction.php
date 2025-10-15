<?php

namespace App\Enums;

enum RecaptchaAction: string
{
    // Auth-Aktionen
    case Login = 'login';
    case Register = 'register';
    case ForgotPassword = 'forgot_password';
    case ResetPassword = 'reset_password';

    // API-Aktionen
    case RenameThisGrid = 'rename_this_grid';
    case SaveUserGrid = 'save_user_grid';
    case ResetUserGrids = 'reset_user_grids';
    case DeleteThisGrid = 'delete_this_grid';
}