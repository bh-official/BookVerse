"use client";

import { motion } from "framer-motion";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: icon, height: icon }}
      >
        {/* Book icon with gradient */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id="bookGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="pageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Back cover */}
          <path
            d="M4 4.5C4 3.12 5.12 2 6.5 2H12C13.38 2 14.5 3.12 14.5 4.5V19.5C14.5 20.88 13.38 22 12 22H6.5C5.12 22 4 20.88 4 19.5V4.5Z"
            fill="url(#bookGradient)"
          />
          {/* Pages */}
          <path
            d="M8 5C8 4.45 7.55 4 7 4H6C5.45 4 5 4.45 5 5V19C5 19.55 5.45 20 6 20H7C7.55 20 8 19.55 8 19V5Z"
            fill="url(#pageGradient)"
          />
          {/* Star/sparkle */}
          <motion.circle
            cx="16"
            cy="8"
            r="2"
            fill="#fbbf24"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>
      <motion.span
        className={`${text} font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        BookVerse
      </motion.span>
    </motion.div>
  );
}
