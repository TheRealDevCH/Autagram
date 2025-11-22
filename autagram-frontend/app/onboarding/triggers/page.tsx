'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TriggersOnboarding() {
  const router = useRouter();
  const [triggers, setTriggers] = useState('');
  const [sensoryOverload, setSensoryOverload] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.triggers = triggers;
      user.sensory_overload = sensoryOverload;
      localStorage.setItem('user', JSON.stringify(user));
      
      router.push('/onboarding/preferences');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/preferences');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#e5e5e5' }}>Welcome to Autagram</h1>
          <p className="text-base" style={{ color: '#888888' }}>Help us understand what might be difficult for you</p>
          <p className="text-sm mt-2" style={{ color: '#666666' }}>Step 1 of 2</p>
        </div>
        
        <div className="p-10 shadow-2xl" style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid #2a2a2a' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="triggers" className="block text-lg font-semibold mb-3" style={{ color: '#e5e5e5' }}>
                What triggers you?
              </label>
              <p className="text-sm mb-3" style={{ color: '#888888' }}>
                Tell us what situations, topics, or content might be difficult or upsetting for you. This helps us show you less of this content.
              </p>
              <textarea
                id="triggers"
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
                rows={4}
                placeholder="Example: Loud noises, sudden changes, crowded places..."
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label htmlFor="sensoryOverload" className="block text-lg font-semibold mb-3" style={{ color: '#e5e5e5' }}>
                What causes sensory overload for you?
              </label>
              <p className="text-sm mb-3" style={{ color: '#888888' }}>
                What sensory experiences are too much for you? This helps us create a more comfortable experience.
              </p>
              <textarea
                id="sensoryOverload"
                value={sensoryOverload}
                onChange={(e) => setSensoryOverload(e.target.value)}
                rows={4}
                placeholder="Example: Bright colors, flashing lights, too many sounds at once..."
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-3.5 rounded-lg font-semibold transition-all duration-200"
                style={{ 
                  backgroundColor: '#2a2a2a', 
                  color: '#888888'
                }}
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-lg font-semibold transition-all duration-200"
                style={{ 
                  backgroundColor: loading ? '#2a2a2a' : '#4a4a4a', 
                  color: '#e5e5e5',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

