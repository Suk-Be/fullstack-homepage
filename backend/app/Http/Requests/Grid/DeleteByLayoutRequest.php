<?php

namespace App\Http\Requests\Grid;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Grid;
use Illuminate\Support\Facades\Auth;
use App\Traits\Recaptcha;
use App\Enums\RecaptchaAction;

class DeleteByLayoutRequest extends FormRequest
{
    use Recaptcha;

    public function authorize(): bool
    {
        $layoutId = $this->route('layoutId');
        $grid = Grid::where('layout_id', $layoutId)->first();
        return $grid && $this->user() && $this->user()->can('delete', $grid);
    }

    public function rules(): array
    {
        return [
            'recaptcha_token' => ['required', 'string'],
        ];
    }

    public function applyDelete(): Grid
    {
        $validated = $this->validated();
        $layoutId = $this->route('layoutId');

        $grid = Grid::where('layout_id', $layoutId)->firstOrFail();

        // Recaptcha prüfen
        $this->verifyRecaptcha($validated['recaptcha_token'], RecaptchaAction::DeleteThisGrid->value);

        $grid->delete();

        return $grid;
    }
}