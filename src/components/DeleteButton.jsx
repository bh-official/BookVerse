"use client";

import { useState } from "react";

export default function DeleteButton({ action, label = "Delete" }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm text-red-400">Confirm?</span>
        <form action={action}>
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-500 transition-all"
          >
            Yes
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-600/30 rounded-full hover:bg-gray-600/50 transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-300 bg-red-600/20 border border-red-500/30 rounded-full hover:bg-red-600/40 hover:border-red-500/50 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </button>
  );
}
