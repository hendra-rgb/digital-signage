<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DisplayController;
use App\Http\Controllers\Api\PlaylistController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\PlaylistCrudController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\DisplayPlaylistController;
use App\Http\Controllers\Api\ScheduleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public endpoints untuk signage
Route::get('/displays', [DisplayController::class, 'index']);
Route::get('/displays/{displayKey}', [DisplayController::class, 'showByKey']);
Route::get('/displays/{displayKey}/playlist', [PlaylistController::class, 'byDisplayKey']);

// Upload media (public storage)
Route::post('/upload', [UploadController::class, 'store']);
Route::get('/contents', [ContentController::class, 'index']);

// CRUD Playlist & Items
Route::get('/playlists', [PlaylistCrudController::class, 'index']);
Route::post('/playlists', [PlaylistCrudController::class, 'store']);
Route::put('/playlists/{playlist}', [PlaylistCrudController::class, 'update']);
Route::delete('/playlists/{playlist}', [PlaylistCrudController::class, 'destroy']);
Route::get('/playlists/{playlist}/items', [PlaylistCrudController::class, 'itemsIndex']);
Route::post('/playlists/{playlist}/items', [PlaylistCrudController::class, 'itemsStore']);
Route::put('/playlist-items/{item}', [PlaylistCrudController::class, 'itemsUpdate']);
Route::delete('/playlist-items/{item}', [PlaylistCrudController::class, 'itemsDestroy']);

// Display-Playlists management
Route::get('/displays/{display}/playlists', [DisplayPlaylistController::class, 'index']);
Route::post('/displays/{display}/playlists', [DisplayPlaylistController::class, 'attach']);
Route::put('/displays/{display}/playlists/{playlist}', [DisplayPlaylistController::class, 'update']);
Route::delete('/displays/{display}/playlists/{playlist}', [DisplayPlaylistController::class, 'detach']);

// Scheduling per display
Route::get('/displays/{display}/schedules', [ScheduleController::class, 'index']);
Route::post('/displays/{display}/schedules', [ScheduleController::class, 'store']);
Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
