'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { Link as LinkIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CreateLinkForm() {
  const { mutate } = useSWRConfig();
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setUrl('');
      setCode('');
      setSuccess(true);
      mutate('/api/links'); // Refresh the list
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-indigo-600" />
        Shorten a new link
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Destination URL
            </label>
            <input
              type="url"
              id="url"
              required
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Code (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="code"
                placeholder="alias"
                pattern="[A-Za-z0-9]{6,8}"
                title="6-8 alphanumeric characters"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex-1">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-left-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-600 text-sm animate-in fade-in slide-in-from-left-1">
                <CheckCircle2 className="w-4 h-4" />
                Link created successfully!
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
