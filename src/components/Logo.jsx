"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { width: 40, height: 80 },
    md: { width: 45, height: 90 },
    lg: { width: 60, height: 120 },
  };

  const { width, height } = sizes[size];

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
        style={{ width, height }}
      >
        <Image
          src="/BookVerse.png"
          alt="BookVerse Logo"
          width={width}
          height={height}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>
      <motion.span
        className={`${
          size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl"
        } font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col">
          <span>BookVerse</span>
          <span
            className={`${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} font-normal text-purple-300 normal-case"`}
          >
            Your Gateway to the Book Universe
          </span>
        </div>
      </motion.span>
    </motion.div>
  );
}
