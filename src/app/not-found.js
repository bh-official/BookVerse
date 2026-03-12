import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-lg mb-8">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:opacity-80 transition-opacity"
      >
        Return Home
      </Link>
    </main>
  );
}
