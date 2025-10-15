<?php

namespace App\Http\Requests\Auth\SpaAuth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Rules\ReCaptchaV3;
use App\Models\User;
use App\Enums\UserRole;
use App\Enums\RecaptchaAction;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Jeder darf sich registrieren
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // Wichtig: recaptcha_token hinzufügen
            'recaptcha_token' => ['required', new ReCaptchaV3(RecaptchaAction::Register->value)],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
        ];
    }

    public function createUser(): User
    {
        return User::create([
            'name' => $this->validated('name'),
            'email' => $this->validated('email'),
            'password' => Hash::make($this->validated('password')),
            'role' => UserRole::User,
        ]);
    }
}
