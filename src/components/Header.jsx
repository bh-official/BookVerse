"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ hideBooks = false }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  // Hide Books and Posts on landing page, books pages, and posts pages
  const isBooksPage = pathname === "/books" || pathname.startsWith("/books/");
  const isPostsPage = pathname === "/posts" || pathname.startsWith("/posts/");
  const shouldHideBooks = hideBooks || isBooksPage || pathname === "/";
  const shouldHidePosts = isPostsPage || pathname === "/";

  return (
    <header className="flex justify-between items-center px-8 py-8 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 shadow-lg">
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
            {!shouldHideBooks && (
              <Link
                href="/books"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Books
              </Link>
            )}
            {!shouldHidePosts && (
              <Link
                href="/posts"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Posts
              </Link>
            )}
            <SignInButton mode="modal">
              <button className="text-white hover:text-pink-300 transition-colors font-semibold">
                Sign In
              </button>
            </SignInButton>
          </>
        ) : (
          <div className="flex items-center gap-6">
            {!shouldHideBooks && (
              <Link
                href="/books"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Books
              </Link>
            )}
            {!shouldHidePosts && (
              <Link
                href="/posts"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Posts
              </Link>
            )}
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
