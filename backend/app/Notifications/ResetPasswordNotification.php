<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;
    public static $createUrlCallback;
    public static $toMailCallback;

    public function __construct($token)
    {
        $this->token = $token;
    }


    public function via($notifiable)
    {
        return ['mail'];
    }


    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173')
            . '/reset-password?token=' . $this->token
            . '&email=' . $notifiable->getEmailForPasswordReset();


        return (new MailMessage)
            ->subject('Passwort zurücksetzen')
            ->greeting('Lieber User,')
            ->line('Sie erhalten diese E-Mail, weil wir eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto erhalten haben.')
            ->action('Passwort zurücksetzen', $frontendUrl)
            ->line('Dieser Passwort-Reset-Link läuft in :count Minuten ab.', [
                'count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire'),
            ])
            ->line('Wenn Sie kein Zurücksetzen des Passworts angefordert haben, ist keine weitere Aktion erforderlich.')
            ->line('')
            ->line('Viele Grüße')
            ->line('Suk-Be Jang')
            ->salutation(' ');



    }

    public static function createUrlUsing($callback)
    {
        static::$createUrlCallback = $callback;
    }
}