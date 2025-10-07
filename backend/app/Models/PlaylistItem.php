<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaylistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'playlist_id',
        'content_id',
        'position',
        'duration',
        'options',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }

    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}


