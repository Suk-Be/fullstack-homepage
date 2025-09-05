<?php

namespace App\Http\Controllers\Api\Grid;

use App\Http\Controllers\Controller;
use App\Models\Grid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GridController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Auth::user()->grids()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'layout_id' => 'required|uuid',
            'name' => 'nullable|string|max:255',
            'config' => 'required|array',
            'timestamp' => 'required|date',
        ]);

        $grid = Auth::user()->grids()->create($validated);

        return response()->json($grid, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $grid = Grid::where('user_id', Auth::id())->findOrFail($id);

        $this->authorize('view', $grid);

        return response()->json($grid);
    }

    /**
     * Update the specified resource in storage.
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

        return response()->json($grid);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $grid = Grid::where('user_id', Auth::id())->findOrFail($id);

        $this->authorize('delete', $grid);

        $grid->delete();

        return response()->noContent();
    }
}
