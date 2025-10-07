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

    public function show(Display $display)
    {
        $display->load(['playlists' => function ($q) {
            $q->where('is_active', true);
        }]);
        return $display;
    }
}


