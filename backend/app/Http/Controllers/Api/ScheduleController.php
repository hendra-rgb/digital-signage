<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Display;
use App\Models\Playlist;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Display $display)
    {
        return $display->id
            ? Schedule::where('display_id', $display->id)->orderBy('start_date')->orderBy('start_time')->get()
            : [];
    }

    public function store(Request $request, Display $display)
    {
        $data = $request->validate([
            'playlist_id' => 'required|exists:playlists,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'days_of_week' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $data['display_id'] = $display->id;
        $sch = Schedule::create($data);
        return response()->json($sch, 201);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->validate([
            'playlist_id' => 'sometimes|exists:playlists,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'days_of_week' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $schedule->update($data);
        return $schedule->fresh();
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->noContent();
    }
}


