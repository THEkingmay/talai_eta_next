
import Link from 'next/link';

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello World</h1>
        <p className="text-gray-600 mb-8">Welcome to your beautifully styled Next.js page with Tailwind CSS!</p>
        <Link href="/auth/loginAndRegister">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors shadow">
            Go to Login / Register
          </button>
        </Link>
      </div>
    </main>
  );
}
