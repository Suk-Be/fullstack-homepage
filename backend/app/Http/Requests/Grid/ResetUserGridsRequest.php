<?php

namespace App\Http\Requests\Grid;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Grid;
use App\Traits\Recaptcha;
use App\Enums\RecaptchaAction;

class ResetUserGridsRequest extends FormRequest
{
    use Recaptcha;

    public function authorize(): bool
    {
        $userId = $this->route('userId');
        if (!$userId) {
            return false;
        }

        $user = User::find($userId);
        if (!$user) {
            return false;
        }

        return $this->user() && $this->user()->can('reset', $user);
    }

    public function rules(): array
    {
        return [
            'recaptcha_token' => ['required', 'string'],
        ];
    }

    /**
     * Löscht alle Grids des Users nach erfolgreicher Validierung
     */
    public function applyReset(): void
    {
        $validated = $this->validated();

        $userId = $this->route('userId');
        if (!$userId) {
            throw ValidationException::withMessages(['userId' => 'UserId konnte nicht ermittelt werden.']);
        }

        $user = User::findOrFail($userId);

        $this->verifyRecaptcha($validated['recaptcha_token'], RecaptchaAction::ResetUserGrids->value);

        Grid::where('user_id', $userId)->delete();
    }
}