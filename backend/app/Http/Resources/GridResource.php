<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GridResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'layout_id' => $this->layout_id,
            'config' => $this->config,
            'timestamp' => $this->timestamp,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
