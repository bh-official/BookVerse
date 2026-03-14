"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LikeButton({
  postId,
  initialLiked,
  likeCount,
  isLoggedIn,
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    const response = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 text-sm transition-colors ${
        liked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
}
