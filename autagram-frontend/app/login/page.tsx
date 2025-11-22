'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await auth.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/feed');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-md p-8" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#e5e5e5' }}>Autagram</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded"
              style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded"
              style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-medium"
            style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#a5a5a5' }}>
          No account yet?{' '}
          <Link href="/register" className="font-medium" style={{ color: '#e5e5e5' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

