<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'likes'])
            ->latest()
            ->paginate(20);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'caption' => 'nullable|string|max:2000',
            'image' => 'required|image|max:10240',
        ]);

        $imagePath = $request->file('image')->store('posts', 'public');

        $post = Post::create([
            'user_id' => $request->user()->id,
            'caption' => $request->caption,
            'image_url' => $imagePath,
        ]);

        return response()->json($post->load('user'), 201);
    }

    public function show(Post $post)
    {
        return response()->json($post->load(['user', 'likes']));
    }

    public function destroy(Post $post)
    {
        $user = auth()->user();

        if ($post->user_id !== $user->id && !$user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($post->image_url);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function feed(Request $request)
    {
        $user = $request->user();

        if ($user->is_admin) {
            $posts = Post::with(['user', 'likes'])
                ->latest()
                ->paginate(20);
        } else {
            $followingIds = $user->following()->pluck('users.id');

            $posts = Post::with(['user', 'likes'])
                ->whereIn('user_id', $followingIds)
                ->orWhere('user_id', $user->id)
                ->latest()
                ->paginate(20);
        }

        return response()->json($posts);
    }
}

