'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreferencesOnboarding() {
  const router = useRouter();
  const [showTriggers, setShowTriggers] = useState(true);
  const [showSensoryOverload, setShowSensoryOverload] = useState(true);
  const [showInterests, setShowInterests] = useState(true);
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.show_triggers = showTriggers;
      user.show_sensory_overload = showSensoryOverload;
      user.show_interests = showInterests;
      user.interests = interests;
      localStorage.setItem('user', JSON.stringify(user));
      
      router.push('/feed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#e5e5e5' }}>Profile Preferences</h1>
          <p className="text-base" style={{ color: '#888888' }}>Choose what you want to share publicly</p>
          <p className="text-sm mt-2" style={{ color: '#666666' }}>Step 2 of 2</p>
        </div>
        
        <div className="p-10 shadow-2xl" style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid #2a2a2a' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#e5e5e5' }}>
                What do you want to show on your public profile?
              </h3>
              <p className="text-sm mb-4" style={{ color: '#888888' }}>
                This helps others understand you better and creates a more supportive community.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ backgroundColor: '#2a2a2a' }}>
                <input
                  type="checkbox"
                  checked={showTriggers}
                  onChange={(e) => setShowTriggers(e.target.checked)}
                  className="w-5 h-5"
                  style={{ accentColor: '#4a4a4a' }}
                />
                <div>
                  <div className="font-medium" style={{ color: '#e5e5e5' }}>Show my triggers</div>
                  <div className="text-sm" style={{ color: '#888888' }}>Let others know what might be difficult for you</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ backgroundColor: '#2a2a2a' }}>
                <input
                  type="checkbox"
                  checked={showSensoryOverload}
                  onChange={(e) => setShowSensoryOverload(e.target.checked)}
                  className="w-5 h-5"
                  style={{ accentColor: '#4a4a4a' }}
                />
                <div>
                  <div className="font-medium" style={{ color: '#e5e5e5' }}>Show my sensory sensitivities</div>
                  <div className="text-sm" style={{ color: '#888888' }}>Help others understand your sensory needs</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ backgroundColor: '#2a2a2a' }}>
                <input
                  type="checkbox"
                  checked={showInterests}
                  onChange={(e) => setShowInterests(e.target.checked)}
                  className="w-5 h-5"
                  style={{ accentColor: '#4a4a4a' }}
                />
                <div>
                  <div className="font-medium" style={{ color: '#e5e5e5' }}>Show my interests</div>
                  <div className="text-sm" style={{ color: '#888888' }}>Share what you're passionate about</div>
                </div>
              </label>
            </div>

            <div>
              <label htmlFor="interests" className="block text-lg font-semibold mb-3" style={{ color: '#e5e5e5' }}>
                What are your interests?
              </label>
              <p className="text-sm mb-3" style={{ color: '#888888' }}>
                Share your special interests and hobbies. This helps you connect with like-minded people.
              </p>
              <textarea
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={4}
                placeholder="Example: Trains, astronomy, programming, music..."
                className="w-full px-4 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#e5e5e5',
                  border: '1px solid #3a3a3a',
                  fontSize: '15px'
                }}
              />
            </div>

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
              {loading ? 'Finishing...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

