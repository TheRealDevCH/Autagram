<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FollowController extends Controller
{
    public function follow(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot follow yourself'], 400);
        }

        DB::table('follows')->insertOrIgnore([
            'follower_id' => $request->user()->id,
            'following_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'User followed']);
    }

    public function unfollow(Request $request, User $user)
    {
        DB::table('follows')
            ->where('follower_id', $request->user()->id)
            ->where('following_id', $user->id)
            ->delete();

        return response()->json(['message' => 'User unfollowed']);
    }

    public function followers(User $user)
    {
        return response()->json($user->followers);
    }

    public function following(User $user)
    {
        return response()->json($user->following);
    }
}

