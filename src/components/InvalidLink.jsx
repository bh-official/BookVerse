import Link from "next/link";

export default function InvalidLink({ title, message, emoji = "⚠️" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/books"
              className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
            >
              Browse Books
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
        <Link
          href="/books"
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          ← Go back to Books
        </Link>
      </div>
    </div>
  );
}
