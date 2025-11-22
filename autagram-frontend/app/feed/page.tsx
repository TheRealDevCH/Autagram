'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { posts as postsApi } from '@/lib/api';
import Link from 'next/link';
import NotificationBell from '@/app/components/NotificationBell';

interface Post {
  id: number;
  user: { id: number; name: string; username: string; is_admin: boolean };
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
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
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const existingReaction = post.likes.find(l => l.user_id === currentUser?.id);
          let newLikes = [...post.likes];

          if (existingReaction) {
            if (existingReaction.reaction_type === reactionType) {
              newLikes = newLikes.filter(l => l.user_id !== currentUser?.id);
            } else {
              newLikes = newLikes.map(l =>
                l.user_id === currentUser?.id
                  ? { ...l, reaction_type: reactionType }
                  : l
              );
            }
          } else {
            newLikes.push({
              id: Date.now(),
              user_id: currentUser?.id,
              reaction_type: reactionType
            });
          }

          return { ...post, likes: newLikes };
        }
        return post;
      })
    );

    try {
      await postsApi.react(postId, reactionType);
    } catch (err) {
      console.error(err);
      loadFeed();
    }
  };

  const handleDeletePost = async (postId: number, postOwnerId: number) => {
    if (currentUser?.is_admin && postOwnerId !== currentUser?.id) {
      const reason = prompt('Bitte gib einen Grund für die Löschung an:');
      if (!reason || reason.trim() === '') {
        alert('Du musst einen Grund angeben!');
        return;
      }

      if (!confirm('Post wirklich löschen?')) return;

      try {
        await postsApi.delete(postId, reason);
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      } catch (err) {
        console.error(err);
      }
    } else {
      if (!confirm('Post wirklich löschen?')) return;

      try {
        await postsApi.delete(postId);
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a', color: '#c0c0c0' }}>
        <div className="text-center">
          <p className="text-lg font-semibold">Lade deinen Feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(25, 25, 112, 0.05) 0%, transparent 50%)'
    }}>
      <header className="border-b backdrop-blur-sm" style={{
        backgroundColor: 'rgba(15, 15, 15, 0.9)',
        borderColor: 'rgba(139, 0, 0, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold" style={{
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 0 30px rgba(139, 0, 0, 0.3)'
          }}>Autagram</h1>
          <div className="flex gap-3 items-center">
            <NotificationBell />
            <Link href="/create" className="px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:brightness-110" style={{
              background: 'linear-gradient(135deg, #8b0000 0%, #4a0000 100%)',
              color: '#ffffff',
              border: '1px solid rgba(139, 0, 0, 0.5)'
            }}>
              Post erstellen
            </Link>
            <Link href="/profile" className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200" style={{ backgroundColor: '#1a1a1a', color: '#c0c0c0', border: '1px solid #2a2a2a' }}>
              Profil
            </Link>
            <button onClick={handleLogout} className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200" style={{ backgroundColor: '#1a1a1a', color: '#c0c0c0', border: '1px solid #2a2a2a' }}>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 rounded-xl" style={{
            backgroundColor: 'rgba(15, 15, 15, 0.6)',
            color: '#808080',
            border: '1px solid #2a2a2a'
          }}>
            <p className="text-xl font-semibold">Noch keine Posts</p>
            <p className="text-sm mt-2">Folge Nutzern oder erstelle deinen ersten Post</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => {
              if (post.is_deleted) {
                return (
                  <div key={post.id} className="rounded-xl p-8 text-center" style={{
                    backgroundColor: 'rgba(139, 0, 0, 0.15)',
                    border: '2px solid rgba(139, 0, 0, 0.5)',
                    boxShadow: '0 4px 20px rgba(139, 0, 0, 0.3)'
                  }}>
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#ff6b6b' }}>
                      Dein Post wurde gelöscht
                    </h3>
                    <div className="p-4 rounded-lg mb-4" style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(139, 0, 0, 0.4)'
                    }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: '#c0c0c0' }}>Grund:</p>
                      <p style={{ color: '#ffffff', fontSize: '15px', lineHeight: '1.6' }}>
                        {post.deletion_reason}
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: '#808080' }}>
                      Gelöscht am {new Date(post.deleted_at).toLocaleString('de-DE')}
                    </p>
                  </div>
                );
              }

              return (
              <div key={post.id} className="rounded-xl overflow-hidden transition-all duration-300" style={{
                backgroundColor: post.user.is_admin ? 'rgba(139, 0, 0, 0.1)' : 'rgba(15, 15, 15, 0.8)',
                border: post.user.is_admin ? '2px solid rgba(139, 0, 0, 0.5)' : '1px solid #2a2a2a',
                boxShadow: post.user.is_admin ? '0 0 30px rgba(139, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold" style={{
                      backgroundColor: post.user.is_admin ? 'rgba(139, 0, 0, 0.3)' : '#1a1a1a',
                      border: post.user.is_admin ? '2px solid rgba(139, 0, 0, 0.6)' : '1px solid #2a2a2a',
                      color: post.user.is_admin ? '#ff6b6b' : '#808080'
                    }}>
                      {post.user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/profile/${post.user.id}`} className="font-bold hover:underline block" style={{ color: '#ffffff' }}>
                        {post.user.username}
                      </Link>
                      {post.user.is_admin && (
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold inline-block mt-1 uppercase tracking-wide" style={{
                          background: 'linear-gradient(135deg, #8b0000 0%, #4a0000 100%)',
                          color: '#ffffff',
                          border: '1px solid rgba(139, 0, 0, 0.6)'
                        }}>
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {currentUser?.is_admin && (
                    <button
                      onClick={() => handleDeletePost(post.id, post.user.id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
                      style={{
                        backgroundColor: 'rgba(139, 0, 0, 0.2)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(139, 0, 0, 0.4)'
                      }}
                    >
                      Löschen
                    </button>
                  )}
                </div>
                <img
                  src={`http://localhost:8585/storage/${post.image_url}`}
                  alt={post.caption || 'Post'}
                  className="w-full"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
                <div className="p-5">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {REACTIONS.map((reaction) => {
                      const count = post.likes.filter(l => l.reaction_type === reaction.type).length;
                      const userReacted = post.likes.some(l => l.reaction_type === reaction.type && l.user_id === JSON.parse(localStorage.getItem('user') || '{}').id);

                      return (
                        <button
                          key={reaction.type}
                          onClick={() => handleReaction(post.id, reaction.type)}
                          className="px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 hover:brightness-110"
                          style={{
                            backgroundColor: userReacted ? reaction.color + '20' : '#1a1a1a',
                            border: `1px solid ${userReacted ? reaction.color : '#2a2a2a'}`,
                            fontSize: '20px'
                          }}
                        >
                          <span>{reaction.emoji}</span>
                          {count > 0 && <span className="font-semibold" style={{ fontSize: '14px', color: userReacted ? reaction.color : '#808080' }}>{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {post.caption && (
                    <p style={{ color: '#c0c0c0', fontSize: '15px', lineHeight: '1.6' }} className="mt-3">
                      <span className="font-bold" style={{ color: '#ffffff' }}>{post.user.username}</span> {post.caption}
                    </p>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

