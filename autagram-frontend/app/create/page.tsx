'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { posts as postsApi } from '@/lib/api';
import Link from 'next/link';

export default function CreatePost() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', image);
      if (caption) {
        formData.append('caption', caption);
      }

      await postsApi.create(formData);
      router.push('/feed');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <header className="border-b" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>Create Post</h1>
          <Link href="/feed" className="px-4 py-2 rounded" style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}>
            Back to Feed
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 rounded"
              style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
            />
          </div>

          {preview && (
            <div className="rounded overflow-hidden">
              <img src={preview} alt="Preview" className="w-full" style={{ maxHeight: '400px', objectFit: 'cover' }} />
            </div>
          )}

          <div>
            <label htmlFor="caption" className="block text-sm font-medium mb-2" style={{ color: '#e5e5e5' }}>
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded"
              style={{ backgroundColor: '#2a2a2a', color: '#e5e5e5', border: '1px solid #3a3a3a' }}
              placeholder="Write a caption..."
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
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </main>
    </div>
  );
}

