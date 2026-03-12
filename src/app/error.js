"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-4xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-lg mb-8">An unexpected error occurred.</p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-gray-200 text-gray-800 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
