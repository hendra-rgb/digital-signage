<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Display;
use Illuminate\Http\Request;

class DisplayController extends Controller
{
    public function index()
    {
        return Display::query()
            ->select(['id','name','location','orientation','online','last_seen_at'])
            ->orderBy('name')
            ->get();
    }

    public function showByKey(string $displayKey)
    {
        // Cari berdasarkan id numerik atau nama persis (case-insensitive)
        $q = Display::query();
        if (ctype_digit($displayKey)) {
            $q->where('id', (int) $displayKey);
        } else {
            $q->whereRaw('LOWER(name) = ?', [mb_strtolower(urldecode($displayKey))]);
        }

        $display = $q->firstOrFail();
        $display->load(['playlists' => function ($q) {
            $q->where('is_active', true);
        }]);
        return $display;
    }
}


