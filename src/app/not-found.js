"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <AlertDialog.Root defaultOpen={true}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <AlertDialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🔍</span>
                </div>
              </motion.div>

              <AlertDialog.Title className="text-3xl font-bold text-center mb-3 text-gray-800">
                404 - Not Found
              </AlertDialog.Title>

              <AlertDialog.Description className="text-lg text-center mb-8 text-gray-600">
                Oops! The page you're looking for seems to have wandered off.
                Let's get you back on track.
              </AlertDialog.Description>

              <div className="flex flex-col gap-3">
                <AlertDialog.Action asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/"
                      className="block w-full bg-[#6c47ff] text-white rounded-full font-semibold py-3 px-6 text-center cursor-pointer hover:bg-[#5a3ce6] transition-colors"
                    >
                      Return Home
                    </Link>
                  </motion.div>
                </AlertDialog.Action>

                <AlertDialog.Cancel asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-100 text-gray-700 rounded-full font-semibold py-3 px-6 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Stay Here
                  </motion.button>
                </AlertDialog.Cancel>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  );
}
