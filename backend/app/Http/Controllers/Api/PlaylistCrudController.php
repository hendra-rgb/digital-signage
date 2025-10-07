<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use App\Models\PlaylistItem;
use App\Models\Content;
use Illuminate\Http\Request;

class PlaylistCrudController extends Controller
{
    // Playlists
    public function index()
    {
        return Playlist::query()->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'loop' => 'boolean',
        ]);
        $playlist = Playlist::create($data);
        return response()->json($playlist, 201);
    }

    public function update(Request $request, Playlist $playlist)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'loop' => 'boolean',
        ]);
        $playlist->update($data);
        return $playlist->fresh();
    }

    public function destroy(Playlist $playlist)
    {
        $playlist->delete();
        return response()->noContent();
    }

    // Items
    public function itemsIndex(Playlist $playlist)
    {
        return $playlist->items()->with('content')->orderBy('position')->get();
    }

    public function itemsStore(Request $request, Playlist $playlist)
    {
        $data = $request->validate([
            'content_id' => 'required|exists:contents,id',
            'position' => 'nullable|integer',
            'duration' => 'nullable|integer',
            'options' => 'array',
        ]);
        if (!isset($data['position'])) {
            $max = (int) $playlist->items()->max('position');
            $data['position'] = $max + 1;
        }
        $item = $playlist->items()->create($data);
        return response()->json($item->load('content'), 201);
    }

    public function itemsUpdate(Request $request, PlaylistItem $item)
    {
        $data = $request->validate([
            'position' => 'nullable|integer',
            'duration' => 'nullable|integer',
            'options' => 'array',
        ]);
        $item->update($data);
        return $item->fresh()->load('content');
    }

    public function itemsDestroy(PlaylistItem $item)
    {
        $item->delete();
        return response()->noContent();
    }
}


