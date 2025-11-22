<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show(User $user)
    {
        return response()->json($user->load(['preferences', 'posts', 'followers', 'following']));
    }

    public function update(Request $request, User $user)
    {
        if ($user->id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'bio' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|max:5120',
            'triggers' => 'nullable|string',
            'sensory_overload' => 'nullable|string',
            'interests' => 'nullable|string',
            'show_triggers' => 'nullable|boolean',
            'show_sensory_overload' => 'nullable|boolean',
            'show_interests' => 'nullable|boolean',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($request->only([
            'name',
            'username',
            'bio',
            'triggers',
            'sensory_overload',
            'interests',
            'show_triggers',
            'show_sensory_overload',
            'show_interests'
        ]));

        return response()->json($user);
    }

    public function updatePreferences(Request $request, User $user)
    {
        if ($user->id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'likes' => 'nullable|string',
            'dislikes' => 'nullable|string',
            'too_much' => 'nullable|string',
        ]);

        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            $request->only(['likes', 'dislikes', 'too_much'])
        );

        return response()->json($preferences);
    }
}

