<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Display;
use App\Models\Playlist;
use Illuminate\Http\Request;

class DisplayPlaylistController extends Controller
{
    public function index(Display $display)
    {
        return $display->playlists()->withPivot('priority')->orderBy('display_playlists.priority')->get();
    }

    public function attach(Request $request, Display $display)
    {
        $data = $request->validate([
            'playlist_id' => 'required|exists:playlists,id',
            'priority' => 'nullable|integer',
        ]);
        $priority = $data['priority'] ?? (int) $display->playlists()->max('display_playlists.priority') + 1;
        $display->playlists()->syncWithoutDetaching([
            $data['playlist_id'] => ['priority' => $priority],
        ]);
        return response()->json(['ok' => true]);
    }

    public function update(Request $request, Display $display, Playlist $playlist)
    {
        $data = $request->validate([
            'priority' => 'required|integer',
        ]);
        $display->playlists()->updateExistingPivot($playlist->id, ['priority' => $data['priority']]);
        return response()->json(['ok' => true]);
    }

    public function detach(Display $display, Playlist $playlist)
    {
        $display->playlists()->detach($playlist->id);
        return response()->noContent();
    }
}


