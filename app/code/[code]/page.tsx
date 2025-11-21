'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  BarChart2, 
  Calendar, 
  Clock, 
  Copy, 
  ExternalLink, 
  ArrowLeft, 
  Loader2,
  Globe
} from 'lucide-react';
import { useState } from 'react';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  totalClicks: number;
  createdAt: string;
  lastClickedAt: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
});

export default function StatsPage() {
  const params = useParams();
  const code = params.code as string;
  const { data: link, error, isLoading } = useSWR<LinkData>(`/api/links/${code}`, fetcher);
  const [copying, setCopying] = useState(false);

  const copyToClipboard = async () => {
    if (!link) return;
    const url = `${window.location.origin}/${link.shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Link not found</h2>
        <p className="text-gray-600 mb-6">The link you are looking for does not exist or has been deleted.</p>
        <Link 
          href="/"
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    );
  }

  const shortUrl = typeof window !== 'undefined' ? `${window.location.origin}/${link.shortCode}` : `/${link.shortCode}`;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-indigo-600" />
              Link Statistics
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                Active
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Short Link
              </label>
              <div className="flex items-center gap-2">
                <a 
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl font-bold text-indigo-600 hover:underline truncate"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200 shadow-sm transition-all active:scale-95"
                  title="Copy to clipboard"
                >
                  {copying ? (
                    <span className="text-xs font-bold text-green-600">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Original Destination
              </label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 truncate break-all"
                >
                  {link.originalUrl}
                </a>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-50 text-indigo-600 rounded-full mb-4">
              <BarChart2 className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{link.totalClicks}</p>
            <p className="text-sm font-medium text-gray-500">Total Clicks</p>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-50 text-orange-600 rounded-full mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {link.lastClickedAt 
                ? new Date(link.lastClickedAt).toLocaleDateString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })
                : 'Never'}
            </p>
            <p className="text-sm font-medium text-gray-500">Last Clicked</p>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {new Date(link.createdAt).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', year: 'numeric' 
              })}
            </p>
            <p className="text-sm font-medium text-gray-500">Created Date</p>
          </div>
        </div>
      </div>
    </main>
  );
}
