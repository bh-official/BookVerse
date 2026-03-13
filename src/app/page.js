"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

const features = [
  {
    icon: "📚",
    title: "Discover Books",
    description: "Explore a vast collection of books shared by our community",
  },
  {
    icon: "✍️",
    title: "Write Reviews",
    description: "Share your thoughts and rate books you've read",
  },
  {
    icon: "📝",
    title: "Create Posts",
    description: "Post updates, recommendations, and book-related content",
  },
  {
    icon: "👤",
    title: "Personal Profile",
    description: "Build your reading identity with a customizable profile",
  },
  {
    icon: "🔐",
    title: "Secure Auth",
    description: "Powered by Clerk for safe and easy authentication",
  },
  {
    icon: "🚀",
    title: "Full Stack",
    description: "Built with Next.js, PostgreSQL, and modern tech",
  },
];

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-6"
          >
            ✨ Your Gateway to the Book Universe
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Discover, Review, &{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Connect
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            BookVerse is a full-stack book review application where you can
            explore books, share your reviews, create posts, and connect with
            fellow book lovers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/books"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform hover:shadow-lg hover:shadow-purple-500/25"
            >
              Explore Books 🚀
            </Link>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <button className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
                  Create Account
                </button>
              </SignUpButton>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features to enhance your reading journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl p-12 text-center border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Dive In?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of book lovers and start your journey today!
          </p>
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button className="px-10 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:scale-105 transition-transform hover:shadow-xl">
                Create Free Account
              </button>
            </SignUpButton>
          ) : (
            <Link
              href="/books"
              className="px-10 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:scale-105 transition-transform hover:shadow-xl"
            >
              Start Reviewing Books
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 border-t border-purple-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-purple-200">
            © 2026 BookVerse. Built with Next.js & PostgreSQL.
          </div>
        </div>
      </footer>
    </div>
  );
}
