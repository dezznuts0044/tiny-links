import CreateLinkForm from './components/CreateLinkForm';
import LinkList from './components/LinkList';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Shorten Your Links
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          TinyLink makes it easy to shorten URLs, track clicks, and manage your links.
          Enter a long URL below to get started.
        </p>
      </div>

      <CreateLinkForm />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Links</h2>
        <LinkList />
      </div>
    </main>
  );
}
