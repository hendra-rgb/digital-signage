<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'loop',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'loop' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(PlaylistItem::class)->orderBy('position');
    }

    public function displays()
    {
        return $this->belongsToMany(Display::class, 'display_playlists')
            ->withPivot(['priority'])
            ->withTimestamps();
    }
}


