"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 shadow-lg">
      {/* Logo / Brand - Left side */}
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-pink-300 transition-colors"
      >
        📚 BookVerse
      </Link>

      {/* Right side - Navigation + Auth */}
      <div className="flex items-center gap-8">
        {!isSignedIn ? (
          <>
            <Link
              href="/books"
              className="text-white hover:text-pink-300 transition-colors font-semibold"
            >
              Books
            </Link>
            <SignInButton mode="modal">
              <button className="text-white hover:text-pink-300 transition-colors font-semibold">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-sm h-10 px-6 cursor-pointer hover:from-pink-400 hover:to-purple-500 transition-all hover:scale-105 shadow-lg">
                Sign Up
              </button>
            </SignUpButton>
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href="/books"
              className="text-white hover:text-pink-300 transition-colors font-semibold"
            >
              Books
            </Link>
            <Link
              href="/users/you"
              className="text-white hover:text-pink-300 transition-colors font-semibold"
            >
              My Profile
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 border-2 border-pink-400 ring-2 ring-purple-500/50",
                },
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
