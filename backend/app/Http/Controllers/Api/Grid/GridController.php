<?php

namespace App\Http\Controllers\Api\Grid;

use App\Http\Controllers\Controller;
use App\Models\Grid;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\GridResource;

class GridController extends Controller
{
    /**
     * Display the authenticated user's grids as JSON, keyed by layoutId,
     * with the latest entries first.
     */
    public function index()
    {
        $grids = Auth::user()->grids()->latest()->get();
        $resources = GridResource::collection($grids)->resolve();

        $mapped = collect($resources)->mapWithKeys(fn($grid) => [$grid['layoutId'] => $grid]);

        return response()->json(['data' => $mapped]);
    }

    /**
     * Store a new grid for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'layoutId' => 'required|uuid',
            'name' => 'nullable|string|max:255',
            'config' => 'required|array',
            'timestamp' => 'required|date',
        ]);

        $gridData = [
            'layout_id' => $validated['layoutId'], // DB-Feld
            'name' => $validated['name'] ?? null,
            'config' => $validated['config'],
            'timestamp' => $validated['timestamp'],
        ];

        $grid = Auth::user()->grids()->create($gridData);

        return response()->json(new GridResource($grid), 201);
    }


    /**
     * Show a specific grid belonging to the authenticated user.
     */
    public function show(string $id)
    {
        $grid = Grid::where('user_id', Auth::id())->findOrFail($id);
        $this->authorize('view', $grid);

        $resource = (new GridResource($grid))->resolve();
        $resource['layoutId'] = $resource['layout_id'];
        unset($resource['layout_id']);

        return response()->json($resource);
    }

    /**
     * Update a specific grid belonging to the authenticated user.
     */
    public function update(Request $request, string $id)
    {
        $grid = Grid::where('user_id', Auth::id())->findOrFail($id);
        $this->authorize('update', $grid);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
            'timestamp' => 'sometimes|date',
        ]);

        $grid->update($validated);

        $resource = (new GridResource($grid))->resolve();

        return response()->json($resource);
    }

    /**
     * Delete a grid by its layoutId, if owned by the authenticated user.
     */
    public function destroyByLayout(string $layoutId)
    {
        $grid = Grid::where('layout_id', $layoutId)->firstOrFail();
        $this->authorize('delete', $grid);

        $grid->delete();
        return response()->noContent();
    }

    /**
     * Reset all grids for a specific user (admin only).
     */
    public function resetUserGrids(int $userId)
    {
        $user = User::findOrFail($userId);
        $this->authorize('reset', $user);

        Grid::where('user_id', $userId)->delete();
        return response()->noContent();
    }
}
