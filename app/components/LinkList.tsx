'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { Copy, Trash2, ExternalLink, BarChart2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  totalClicks: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LinkList() {
  const { data: links, error, isLoading, mutate } = useSWR<LinkData[]>('/api/links', fetcher);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    const url = `${window.location.origin}/${code}`;
    await navigator.clipboard.writeText(url);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const deleteLink = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    setDeletingId(code);
    try {
      await fetch(`/api/links/${code}`, { method: 'DELETE' });
      mutate(); // Refresh list
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete link');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-100">
        Failed to load links. Please try again.
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
        <p className="text-gray-500">No links created yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900">Short Link</th>
              <th className="px-6 py-4 font-semibold text-gray-900">Original URL</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-center">Clicks</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/code/${link.shortCode}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      /{link.shortCode}
                    </Link>
                    <button
                      onClick={() => copyToClipboard(link.shortCode, link.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy short link"
                    >
                      {copyingId === link.id ? (
                        <span className="text-xs text-green-600 font-medium">Copied!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 max-w-[300px]">
                    <span className="truncate text-gray-600" title={link.originalUrl}>
                      {link.originalUrl}
                    </span>
                    <a 
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium text-xs">
                    <BarChart2 className="w-3 h-3" />
                    {link.totalClicks}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteLink(link.shortCode)}
                    disabled={deletingId === link.shortCode}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    title="Delete link"
                  >
                    {deletingId === link.shortCode ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
