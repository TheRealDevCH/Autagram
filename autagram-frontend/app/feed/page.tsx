'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { posts as postsApi } from '@/lib/api';
import Link from 'next/link';

interface Post {
  id: number;
  user: { id: number; name: string; username: string };
  caption: string;
  image_url: string;
  created_at: string;
  likes: Array<{ id: number; reaction_type: string; user_id: number }>;
}

const REACTIONS = [
  { type: 'happy', emoji: '😊', color: '#4ade80' },
  { type: 'sad', emoji: '😢', color: '#60a5fa' },
  { type: 'angry', emoji: '😠', color: '#f87171' },
  { type: 'surprised', emoji: '😲', color: '#fbbf24' },
  { type: 'thoughtful', emoji: '🤔', color: '#a78bfa' },
];

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadFeed();
  }, [router]);

  const loadFeed = async () => {
    try {
      const data = await postsApi.getFeed();
      setPosts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId: number, reactionType: string) => {
    try {
      await postsApi.react(postId, reactionType);
      loadFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <header className="border-b" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>Autagram</h1>
          <div className="flex gap-4">
            <Link href="/create" className="px-4 py-2 rounded" style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}>
              Create Post
            </Link>
            <Link href="/profile" className="px-4 py-2 rounded" style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}>
              Profile
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded" style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#a5a5a5' }}>
            No posts yet. Follow users or create your first post.
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <div className="p-4">
                  <Link href={`/profile/${post.user.id}`} className="font-medium" style={{ color: '#e5e5e5' }}>
                    {post.user.username}
                  </Link>
                </div>
                <img
                  src={`http://localhost:8585/storage/${post.image_url}`}
                  alt={post.caption || 'Post'}
                  className="w-full"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
                <div className="p-4">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {REACTIONS.map((reaction) => {
                      const count = post.likes.filter(l => l.reaction_type === reaction.type).length;
                      const userReacted = post.likes.some(l => l.reaction_type === reaction.type && l.user_id === JSON.parse(localStorage.getItem('user') || '{}').id);

                      return (
                        <button
                          key={reaction.type}
                          onClick={() => handleReaction(post.id, reaction.type)}
                          className="px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5"
                          style={{
                            backgroundColor: userReacted ? reaction.color + '20' : '#2a2a2a',
                            border: `2px solid ${userReacted ? reaction.color : '#3a3a3a'}`,
                            fontSize: '20px'
                          }}
                        >
                          <span>{reaction.emoji}</span>
                          {count > 0 && <span className="font-semibold" style={{ fontSize: '14px', color: userReacted ? reaction.color : '#b5b5b5' }}>{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {post.caption && (
                    <p style={{ color: '#e5e5e5' }} className="mt-2">
                      <span className="font-medium">{post.user.username}</span> {post.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

