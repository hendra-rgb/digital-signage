<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB
            'title' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $mime = $file->getMimeType();
        $isVideo = str_contains($mime, 'video');
        $isImage = str_contains($mime, 'image');

        if (!($isVideo || $isImage)) {
            return response()->json(['message' => 'Tipe file tidak didukung'], 422);
        }

        $path = $file->storePublicly('uploads', 'public');
        $publicUrl = Storage::disk('public')->url($path);

        $content = Content::create([
            'title' => $request->input('title') ?: $file->getClientOriginalName(),
            'type' => $isVideo ? 'video' : 'image',
            'path' => '/storage/' . ltrim($path, '/'),
            'url' => $publicUrl,
            'duration' => null,
            'metadata' => [],
        ]);

        return response()->json([
            'id' => $content->id,
            'title' => $content->title,
            'type' => $content->type,
            'url' => $publicUrl,
            'path' => $content->path,
        ], 201);
    }
}


