<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('display_playlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('display_id')->constrained('displays')->cascadeOnDelete();
            $table->foreignId('playlist_id')->constrained('playlists')->cascadeOnDelete();
            $table->unsignedInteger('priority')->default(0);
            $table->timestamps();
            $table->unique(['display_id', 'playlist_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('display_playlists');
    }
};


