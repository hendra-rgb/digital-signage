<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;

class ContentController extends Controller
{
    public function index()
    {
        return Content::query()
            ->select(['id','title','type','url','path','duration'])
            ->orderBy('id','desc')
            ->paginate(50);
    }
}


