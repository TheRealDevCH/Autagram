<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Notification;
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

    public function destroy(Request $request, Post $post)
    {
        $user = auth()->user();

        if ($post->user_id !== $user->id && !$user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->is_admin && $post->user_id !== $user->id) {
            $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            $post->is_deleted = true;
            $post->deletion_reason = $request->reason;
            $post->deleted_by = $user->id;
            $post->deleted_at = now();
            $post->save();

            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_deleted',
                'title' => 'Post von Admin gelöscht',
                'message' => 'Ein Administrator hat einen deiner Posts gelöscht.',
                'reason' => $request->reason,
                'data' => [
                    'post_id' => $post->id,
                    'admin_id' => $user->id,
                    'admin_username' => $user->username,
                ],
            ]);

            return response()->json(['message' => 'Post als gelöscht markiert']);
        }

        Storage::disk('public')->delete($post->image_url);
        $post->delete();

        return response()->json(['message' => 'Post erfolgreich gelöscht']);
    }

    public function feed(Request $request)
    {
        $user = $request->user();

        if ($user->is_admin) {
            $posts = Post::with(['user', 'likes'])
                ->where(function($query) use ($user) {
                    $query->where('is_deleted', false)
                          ->orWhere(function($q) use ($user) {
                              $q->where('is_deleted', true)
                                ->where('user_id', $user->id);
                          });
                })
                ->latest()
                ->paginate(20);
        } else {
            $followingIds = $user->following()->pluck('users.id');

            $posts = Post::with(['user', 'likes'])
                ->where(function($query) use ($user) {
                    $query->where('is_deleted', false)
                          ->orWhere(function($q) use ($user) {
                              $q->where('is_deleted', true)
                                ->where('user_id', $user->id);
                          });
                })
                ->where(function($query) use ($followingIds, $user) {
                    $query->whereIn('user_id', $followingIds)
                          ->orWhere('user_id', $user->id);
                })
                ->latest()
                ->paginate(20);
        }

        return response()->json($posts);
    }
}

