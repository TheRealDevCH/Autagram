'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email !== emailConfirm) {
      setError('Email addresses do not match');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await auth.register({ name, username, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/onboarding/triggers');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#e5e5e5', letterSpacing: '-0.02em' }}>Autagram</h1>
          <p className="text-base" style={{ color: '#888888' }}>Autism-friendly social platform</p>
        </div>

        <div className="p-10 shadow-2xl" style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid #2a2a2a' }}>
          <h2 className="text-2xl font-semibold mb-8" style={{ color: '#e5e5e5' }}>Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="emailConfirm" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Confirm Email Address
              </label>
              <input
                id="emailConfirm"
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Password (min. 8 characters)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2" style={{ color: '#b5b5b5' }}>
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#2a1a1a', color: '#ff6b6b', border: '1px solid #3a2a2a' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-semibold transition-all duration-200 mt-6"
              style={{
                backgroundColor: loading ? '#2a2a2a' : '#4a4a4a',
                color: '#e5e5e5',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: '#2a2a2a' }}>
            <p className="text-center text-sm" style={{ color: '#888888' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold transition-colors" style={{ color: '#e5e5e5' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

