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
            'id'        => $this->id,
            'name'      => $this->name,
            'layoutId'  => $this->layout_id, // hier schon camelCase!
            'config'    => $this->config,
            'timestamp' => $this->timestamp,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}