<?php

namespace App\Http\Requests\Grid;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Grid;
use App\Http\Resources\GridResource;
use App\Traits\Recaptcha;
use App\Traits\ApiResponses;
use App\Enums\RecaptchaAction;

class SaveNewGridRequest extends FormRequest
{
    use Recaptcha, ApiResponses;

    public function authorize(): bool
    {
        // Nur eingeloggte User dürfen speichern
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'layoutId' => ['required', 'uuid'],
            'name' => ['nullable', 'string', 'max:255'],
            'config' => ['required', 'array'],
            'timestamp' => ['required', 'date'],
            'recaptcha_token' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'layoutId.required' => 'Eine Layout-ID ist erforderlich.',
            'config.required' => 'Eine Grid-Konfiguration ist erforderlich.',
            'timestamp.required' => 'Ein Zeitstempel ist erforderlich.',
            'recaptcha_token.required' => 'reCAPTCHA-Token fehlt.',
        ];
    }

    public function applySave(): GridResource|\Illuminate\Http\JsonResponse
    {
        // ✅ reCAPTCHA prüfen
        $this->verifyRecaptcha($this->recaptcha_token, RecaptchaAction::SaveUserGrid->value);

        // 🧩 sortierte Config und JSON kodieren
        $sortedConfig = $this->validated('config');
        ksort($sortedConfig);
        $encodedConfig = json_encode($sortedConfig);

        // 🧩 Prüfen auf Duplikate
        $user = Auth::user();

        if ($user->grids()->where('layout_id', $this->layoutId)->exists()) {
            return $this->error('A grid with the same layoutId already exists.');
        }

        if ($user->grids()->where('config', $encodedConfig)->exists()) {
            return $this->error('A grid with the same configuration already exists.');
        }

        if ($this->name && $user->grids()->where('name', $this->name)->exists()) {
            return $this->error('A grid with the same name already exists.');
        }

        // 🧩 Grid speichern
        $grid = $user->grids()->create([
            'layout_id' => $this->layoutId,
            'name' => $this->name,
            'config' => $this->config,
            'timestamp' => $this->timestamp,
        ]);

        return new GridResource($grid);
    }
}
