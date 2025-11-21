import Link from 'next/link';
import { Link2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Link2 className="w-6 h-6" />
          <span>TinyLink</span>
        </Link>
        <nav className="flex gap-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
