<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DisplayController;
use App\Http\Controllers\Api\PlaylistController;

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
Route::get('/displays/{display}', [DisplayController::class, 'show']);
Route::get('/displays/{display}/playlist', [PlaylistController::class, 'byDisplay']);
