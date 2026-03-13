"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-white/10">
      {/* Logo / Brand - Left side */}
      <Link
        href="/"
        className="text-xl font-bold text-white hover:text-purple-300 transition-colors"
      >
        📚 BookVerse
      </Link>

      {/* Right side - Navigation + Auth */}
      <div className="flex items-center gap-6">
        {!isSignedIn ? (
          <>
            <Link
              href="/books"
              className="text-white hover:text-purple-300 transition-colors font-medium"
            >
              Books
            </Link>
            <SignInButton mode="modal">
              <button className="text-white hover:text-purple-300 transition-colors font-medium">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-purple-600 text-white rounded-full font-medium text-sm h-10 px-5 cursor-pointer hover:bg-purple-500 transition-all hover:scale-105">
                Sign Up
              </button>
            </SignUpButton>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/books"
              className="text-white hover:text-purple-300 transition-colors font-medium"
            >
              Books
            </Link>
            <Link
              href="/users/you"
              className="text-white hover:text-purple-300 transition-colors text-sm font-medium"
            >
              My Profile
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-purple-400",
                },
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
