import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gray-100 p-4 rounded-full mb-6">
        <FileQuestion className="w-8 h-8 text-gray-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow focus:ring-4 focus:ring-indigo-100"
      >
        Return Home
      </Link>
    </div>
  );
}
