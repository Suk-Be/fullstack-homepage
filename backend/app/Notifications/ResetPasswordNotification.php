<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang; // Für Übersetzungen

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;
    public static $createUrlCallback;
    public static $toMailCallback;

    /**
     * Create a new notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        // Wenn Sie eine SPA haben, MÜSSEN Sie hier Ihre Frontend-URL angeben:
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $this->token . '&email=' . $notifiable->getEmailForPasswordReset();


        return (new MailMessage)
            ->subject(Lang::get('Passwort zurücksetzen Benachrichtigung'))
            ->line(Lang::get('Sie erhalten diese E-Mail, weil wir eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto erhalten haben.'))
            ->action(Lang::get('Passwort zurücksetzen'), $frontendUrl) // Verwenden Sie Ihre Frontend-URL hier!
            ->line(Lang::get('Dieser Passwort-Reset-Link läuft in :count Minuten ab.', ['count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire')]))
            ->line(Lang::get('Wenn Sie kein Zurücksetzen des Passworts angefordert haben, ist keine weitere Aktion erforderlich.'));
    }

    /**
     * Set a callback that should be used to create the reset password URL.
     *
     * @param  \Closure  $callback
     * @return void
     */
    public static function createUrlUsing($callback)
    {
        static::$createUrlCallback = $callback;
    }
}
