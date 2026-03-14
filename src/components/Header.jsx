"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Header({ hideBooks = false }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  // Hide Books and Posts on landing page, books pages, and posts pages
  const isBooksPage = pathname === "/books" || pathname.startsWith("/books/");
  const isPostsPage = pathname === "/posts" || pathname.startsWith("/posts/");
  const shouldHideBooks =
    hideBooks || isBooksPage || pathname === "/" || pathname === "/categories";
  const shouldHidePosts = isPostsPage || pathname === "/";
  const shouldHideCategories = pathname === "/" || pathname === "/categories";
  const shouldHideMyProfile = pathname === "/users/you";

  return (
    <header className="flex justify-between items-center px-8 py-8 h-24 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 shadow-lg">
      {/* Logo / Brand - Left side */}
      <Link href="/" className="flex items-center">
        <Logo size="md" />
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
            {!shouldHideCategories && (
              <Link
                href="/categories"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Categories
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
            {!shouldHideCategories && (
              <Link
                href="/categories"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                Categories
              </Link>
            )}
            {!shouldHideMyProfile && (
              <Link
                href="/users/you"
                className="text-white hover:text-pink-300 transition-colors font-semibold"
              >
                My Profile
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 border-2 border-pink-400 ring-2 ring-purple-500/50",
                  // User menu dropdown styling
                  userButtonPopover:
                    "bg-slate-800 border border-purple-500 rounded-lg shadow-xl",
                  userButtonPopoverActionButton:
                    "text-white hover:bg-purple-700 transition-colors",
                  userButtonPopoverActionButtonText: "text-white",
                  userButtonPopoverFooter: "border-t border-purple-500",
                  userButtonTrigger: "w-10 h-10",
                  // Dropdown menu items
                  userButtonMenuItems:
                    "bg-slate-800 hover:bg-purple-700 transition-colors",
                  // Sign in button styling
                  formButtonPrimary:
                    "bg-purple-600 hover:bg-purple-700 text-white",
                  // Card styling
                  card: "bg-slate-800 border border-purple-500",
                  // Input styling
                  input: "bg-slate-700 border-purple-500 text-white",
                  label: "text-purple-300",
                },
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
