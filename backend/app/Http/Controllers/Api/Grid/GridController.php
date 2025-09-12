<?php

namespace App\Http\Controllers\Api\Grid;

use App\Http\Controllers\Controller;
use App\Models\Grid;
use App\Models\User;
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
     * Remove this specified layout config if you are the owner from storage.
     */
    public function destroyByLayout(string $layoutId)
    {
        // firstOrFail() wirft eine 404, wenn es nicht existiert.
        $grid = Grid::where('layout_id', $layoutId)->firstOrFail();

        // GridPolicy check, Wenn nicht, wird eine 403 Forbidden-Antwort zurückgegeben.
        $this->authorize('delete', $grid);

        // authorization pass
        $grid->delete();

        return response()->noContent();
    }

    /**
     * Remove savedGrids (can be many layoutIds) if you are admin from storage.
     */
    public function resetUserGrids(int $userId)
    {
        $user = User::findOrFail($userId);
        $this->authorize('reset', $user);

        Grid::where('user_id', $userId)->delete();

        return response()->noContent();

        // test request
        // $authUser = auth()->user();

        // return response()->json([
        //     'authUserId' => $authUser ? $authUser->id : null,
        //     'authUserRole' => $authUser ? $authUser->role : null,
        //     'requestedUserId' => $userId,
        //     'match' => $authUser ? $authUser->id === $userId : false
        // ]);
    }

}
