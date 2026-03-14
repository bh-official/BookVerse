import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";

// Generate a color based on the username
function getAvatarColor(username) {
  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-fuchsia-500 to-pink-500",
    "from-teal-500 to-cyan-500",
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export default async function PostsPage() {
  const user = await getUser();
  const currentUserId = user ? user[0].id : null;

  // Get all posts with user info and like counts
  const posts = (
    await db.query(
      `SELECT postss.*, user_account.username, user_account.clerk_id 
       FROM postss 
       JOIN user_account ON postss.user_id = user_account.id 
       ORDER BY postss.created_at DESC`,
    )
  ).rows;

  // Get like counts for all posts
  const postIds = posts.map((p) => p.id);
  let likeCounts = {};
  let userLikes = {};

  if (postIds.length > 0) {
    const likeCountsResult = await db.query(
      `SELECT post_id, COUNT(*) as count FROM post_likes WHERE post_id = ANY($1) GROUP BY post_id`,
      [postIds],
    );
    likeCountsResult.rows.forEach((row) => {
      likeCounts[row.post_id] = parseInt(row.count);
    });

    // Check which posts the current user has liked
    if (currentUserId) {
      const userLikesResult = await db.query(
        `SELECT post_id FROM post_likes WHERE user_id = $1 AND post_id = ANY($2)`,
        [currentUserId, postIds],
      );
      userLikesResult.rows.forEach((row) => {
        userLikes[row.post_id] = true;
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8">All Posts</h1>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No posts yet. Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
              >
                <Link href={`/users/${post.user_id}`} className="block">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${getAvatarColor(post.username || "")} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {post.username ? post.username[0].toUpperCase() : "?"}
                    </div>
                    <span className="text-white font-semibold hover:text-pink-300 transition-colors">
                      {post.username || "Unknown User"}
                    </span>
                  </div>
                  <p className="text-white text-lg mb-4">{post.content}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </p>
                </Link>

                {/* Like Button */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                  <LikeButton
                    postId={post.id}
                    initialLiked={!!userLikes[post.id]}
                    likeCount={likeCounts[post.id] || 0}
                    isLoggedIn={!!currentUserId}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
