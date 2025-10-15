<?php

namespace App\Http\Requests\Grid;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use App\Models\Grid;
use Illuminate\Support\Facades\Auth;
use App\Traits\Recaptcha;
use App\Enums\RecaptchaAction;

class UpdateByLayoutRequest extends FormRequest
{
    use Recaptcha;

    public function authorize(): bool
    {
        $layoutId = $this->getLayoutIdFromRoute();

        if (!$layoutId) {
            return false;
        }

        $grid = Grid::where('layout_id', $layoutId)->first();
        if (!$grid) {
            return false;
        }

        return $this->user() && $this->user()->can('update', $grid);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'recaptcha_token' => ['required', 'string'],
        ];
    }

    protected function getLayoutIdFromRoute(): ?string
    {
        $routeValue = $this->route('layoutId')
                   ?? $this->route('layout_id')
                   ?? $this->route('id');

        if (is_object($routeValue)) {
            return (string) ($routeValue->layout_id ?? $routeValue->id ?? null);
        }

        return $routeValue ? (string) $routeValue : null;
    }

    public function applyUpdate(): Grid
    {
        $validated = $this->validated();
        $layoutId = $this->getLayoutIdFromRoute();

        if (!$layoutId) {
            throw ValidationException::withMessages(['layoutId' => 'LayoutId konnte nicht ermittelt werden.']);
        }

        $grid = Grid::where('layout_id', $layoutId)->firstOrFail();
        $this->user()->can('update', $grid);

        // reCAPTCHA direkt prüfen und Exception bei Fehler werfen
        $this->verifyRecaptcha($validated['recaptcha_token'], RecaptchaAction::RenameThisGrid->value);

        // Prüfen, ob der Name bereits existiert (anderes Grid)
        $existsByName = Grid::where('user_id', Auth::id())
            ->where('name', $validated['name'])
            ->where('layout_id', '!=', $layoutId)
            ->exists();

        if ($existsByName) {
            throw ValidationException::withMessages(['name' => 'A grid with this name already exists.']);
        }

        $grid->update(['name' => $validated['name']]);

        return $grid;
    }
}