<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like(Request $request, Post $post)
    {
        $request->validate([
            'reaction_type' => 'required|string|in:happy,sad,angry,surprised,thoughtful',
        ]);

        $like = Like::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'post_id' => $post->id,
            ],
            [
                'reaction_type' => $request->reaction_type,
            ]
        );

        return response()->json(['message' => 'Reaction added', 'like' => $like]);
    }

    public function unlike(Request $request, Post $post)
    {
        Like::where('user_id', $request->user()->id)
            ->where('post_id', $post->id)
            ->delete();

        return response()->json(['message' => 'Post unliked']);
    }
}

