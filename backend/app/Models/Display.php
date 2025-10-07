<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Display extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'resolution_width',
        'resolution_height',
        'orientation',
        'online',
        'last_seen_at',
        'settings',
    ];

    protected $casts = [
        'online' => 'boolean',
        'last_seen_at' => 'datetime',
        'settings' => 'array',
    ];

    public function playlists()
    {
        return $this->belongsToMany(Playlist::class, 'display_playlists')
            ->withPivot(['priority'])
            ->withTimestamps()
            ->orderBy('display_playlists.priority');
    }
}


