'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { users as usersApi } from '@/lib/api';
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

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadUser();
  }, [router, userId]);

  const loadUser = async () => {
    try {
      const data = await usersApi.getById(parseInt(userId));
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

        {user.preferences && (
          <div className="rounded-lg p-6" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: '#e5e5e5' }}>Preferences</h3>

            <div className="space-y-6">
              {user.preferences.likes && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                    What they like
                  </label>
                  <p style={{ color: '#e5e5e5' }}>{user.preferences.likes}</p>
                </div>
              )}

              {user.preferences.dislikes && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                    What they dislike
                  </label>
                  <p style={{ color: '#e5e5e5' }}>{user.preferences.dislikes}</p>
                </div>
              )}

              {user.preferences.too_much && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
                    What is too much for them
                  </label>
                  <p style={{ color: '#e5e5e5' }}>{user.preferences.too_much}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

