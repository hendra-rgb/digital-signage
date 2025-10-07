<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Display;

class PlaylistController extends Controller
{
    // Ambil playlist aktif untuk sebuah display (dengan items dan content)
    public function byDisplayKey(string $displayKey)
    {
        $q = Display::query();
        if (ctype_digit($displayKey)) {
            $q->where('id', (int) $displayKey);
        } else {
            $q->whereRaw('LOWER(name) = ?', [mb_strtolower(urldecode($displayKey))]);
        }
        $display = $q->firstOrFail();

        $display->load(['playlists' => function ($q) {
            $q->where('is_active', true)
              ->with(['items.content']);
        }]);

        // Flatten: gabungkan semua items dari semua playlist aktif terurut
        $items = collect();
        foreach ($display->playlists as $playlist) {
            foreach ($playlist->items as $item) {
                $items->push([
                    'playlist_id' => $playlist->id,
                    'playlist_name' => $playlist->name,
                    'position' => $item->position,
                    'duration' => $item->duration,
                    'options' => $item->options,
                    'content' => [
                        'id' => $item->content->id,
                        'title' => $item->content->title,
                        'type' => $item->content->type,
                        'path' => $item->content->path,
                        'url' => $item->content->url,
                        'duration' => $item->content->duration,
                        'metadata' => $item->content->metadata,
                    ],
                ]);
            }
        }

        // Urutkan berdasarkan position dalam masing-masing playlist, lalu priority display_playlist implicit via orderBy relasi display->playlists
        $items = $items->sortBy(['playlist_id','position'])->values();

        return [
            'display' => [
                'id' => $display->id,
                'name' => $display->name,
            ],
            'items' => $items,
        ];
    }
}


