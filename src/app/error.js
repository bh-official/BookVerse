"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <AnimatePresence mode="wait">
        <AlertDialog.Root defaultOpen={true} key="error-dialog">
          <AlertDialog.Portal>
            <AlertDialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
            </AlertDialog.Overlay>
            <AlertDialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-5xl">⚠️</span>
                  </div>
                </motion.div>

                <AlertDialog.Title className="text-3xl font-bold text-center mb-3 text-gray-800">
                  Oops! Something went wrong
                </AlertDialog.Title>

                <AlertDialog.Description className="text-lg text-center mb-8 text-gray-600">
                  Don't worry, it's not your fault. Our team has been notified.
                  Would you like to try again?
                </AlertDialog.Description>

                <div className="flex flex-col gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => reset()}
                      className="w-full bg-[#6c47ff] text-white rounded-full font-semibold py-3 px-6 cursor-pointer hover:bg-[#5a3ce6] transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/"
                      className="block w-full bg-gray-100 text-gray-700 rounded-full font-semibold py-3 px-6 text-center cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Return Home
                    </Link>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-center mt-6 text-gray-400"
                >
                  Error: {error?.message || "Unknown error"}
                </motion.p>
              </motion.div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </AnimatePresence>
    </main>
  );
}
