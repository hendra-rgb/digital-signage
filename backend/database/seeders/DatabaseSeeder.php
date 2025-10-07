<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Display;
use App\Models\Playlist;
use App\Models\PlaylistItem;
use App\Models\Content;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed contoh Display
        $display = Display::query()->firstOrCreate([
            'name' => 'Lobby TV',
        ], [
            'location' => 'Lobby',
            'resolution_width' => 1920,
            'resolution_height' => 1080,
            'orientation' => 'landscape',
            'online' => true,
        ]);

        // Seed konten
        $content1 = Content::query()->firstOrCreate([
            'title' => 'Welcome Text', 'type' => 'html'
        ], [
            'duration' => 8000,
            'metadata' => [
                'text' => 'Selamat Datang!',
                'size' => '4xl',
                'color' => '#ffffff',
                'bg' => '#000000',
                'marquee' => true,
                'speed' => 6,
            ],
        ]);

        $content2 = Content::query()->firstOrCreate([
            'title' => 'Promo Image', 'type' => 'image'
        ], [
            'path' => '/media/sample.jpg',
            'duration' => 7000,
            'metadata' => [
                'overlayText' => 'Diskon 50% Hari Ini',
                'overlaySize' => 'lg',
                'tickerText' => 'Info: Kunjungi counter untuk detail promo.',
                'tickerSpeed' => 10,
            ],
        ]);

        // Seed playlist
        $playlist = Playlist::query()->firstOrCreate([
            'name' => 'Main Loop'
        ], [
            'description' => 'Playlist utama signage',
            'is_active' => true,
            'loop' => true,
        ]);

        // Items
        PlaylistItem::query()->firstOrCreate([
            'playlist_id' => $playlist->id,
            'content_id' => $content1->id,
            'position' => 1,
        ], [
            'duration' => 8000,
            'options' => [],
        ]);
        PlaylistItem::query()->firstOrCreate([
            'playlist_id' => $playlist->id,
            'content_id' => $content2->id,
            'position' => 2,
        ], [
            'duration' => 7000,
            'options' => [],
        ]);

        // Hubungkan display dengan playlist
        if (! $display->playlists()->where('playlists.id', $playlist->id)->exists()) {
            $display->playlists()->attach($playlist->id, ['priority' => 0]);
        }
    }
}
