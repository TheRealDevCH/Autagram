'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, users as usersApi } from '@/lib/api';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  preferences?: {
    likes: string;
    dislikes: string;
    too_much: string;
  };
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [tooMuch, setTooMuch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadUser();
  }, [router]);

  const loadUser = async () => {
    try {
      const data = await auth.getUser();
      setUser(data);
      setLikes(data.preferences?.likes || '');
      setDislikes(data.preferences?.dislikes || '');
      setTooMuch(data.preferences?.too_much || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      await usersApi.updatePreferences(user.id, {
        likes,
        dislikes,
        too_much: tooMuch,
      });
      setEditMode(false);
      loadUser();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <header className="border-b" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>Profile</h1>
          <Link href="/feed" className="px-4 py-2 rounded" style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}>
            Back to Feed
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#e5e5e5' }}>{user.name}</h2>
          <p className="mb-4" style={{ color: '#a5a5a5' }}>@{user.username}</p>
          {user.bio && <p style={{ color: '#e5e5e5' }}>{user.bio}</p>}
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#e5e5e5' }}>Preferences</h3>
            <button
              onClick={() => editMode ? handleSavePreferences() : setEditMode(true)}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}
            >
              {editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                What I like
              </label>
              {editMode ? (
                <textarea
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded"
                  style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
                />
              ) : (
                <p style={{ color: '#e5e5e5' }}>{likes || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                What I dislike
              </label>
              {editMode ? (
                <textarea
                  value={dislikes}
                  onChange={(e) => setDislikes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded"
                  style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
                />
              ) : (
                <p style={{ color: '#e5e5e5' }}>{dislikes || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                What is too much for me
              </label>
              {editMode ? (
                <textarea
                  value={tooMuch}
                  onChange={(e) => setTooMuch(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded"
                  style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
                />
              ) : (
                <p style={{ color: '#e5e5e5' }}>{tooMuch || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

