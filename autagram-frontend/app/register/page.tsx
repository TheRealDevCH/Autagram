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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(25, 25, 112, 0.1) 0%, transparent 50%)'
    }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-3" style={{
            color: '#ffffff',
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(139, 0, 0, 0.3)'
          }}>Autagram</h1>
          <p className="text-lg font-medium" style={{ color: '#a0a0a0' }}>Soziale Plattform für Autisten</p>
        </div>

        <div className="p-10 shadow-2xl backdrop-blur-sm" style={{
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          borderRadius: '20px',
          border: '1px solid rgba(139, 0, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#ffffff' }}>Konto erstellen</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                Vollständiger Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                Benutzername
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="emailConfirm" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                E-Mail bestätigen
              </label>
              <input
                id="emailConfirm"
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                Passwort (min. 8 Zeichen)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#b0b0b0' }}>
                Passwort bestätigen
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-900"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontSize: '15px'
                }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg font-medium" style={{
                backgroundColor: 'rgba(139, 0, 0, 0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(139, 0, 0, 0.4)'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-bold text-base transition-all duration-200 mt-6"
              style={{
                background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #8b0000 0%, #4a0000 100%)',
                color: '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(139, 0, 0, 0.5)',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(139, 0, 0, 0.3)'
              }}
            >
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: '#2a2a2a' }}>
            <p className="text-center text-sm" style={{ color: '#808080' }}>
              Bereits ein Konto?{' '}
              <Link href="/login" className="font-semibold hover:underline transition-colors" style={{ color: '#c0c0c0' }}>
                Anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

