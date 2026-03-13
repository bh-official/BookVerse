"use client";

import { useState } from "react";

export default function DeleteButton({ action, label = "Delete" }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm text-red-500">Confirm?</span>
        <form action={action}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline cursor-pointer"
          >
            Yes
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="text-sm text-gray-500 hover:underline cursor-pointer"
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
      className="text-sm text-red-500 hover:underline cursor-pointer"
    >
      {label}
    </button>
  );
}
