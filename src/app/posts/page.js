import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import Link from "next/link";

export default async function PostsPage() {
  const user = await getUser();

  // Get all posts with user info
  const posts = (
    await db.query(
      `SELECT postss.*, user_account.username, user_account.clerk_id 
       FROM postss 
       JOIN user_account ON postss.user_id = user_account.id 
       ORDER BY postss.created_at DESC`,
    )
  ).rows;

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
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.username ? post.username[0].toUpperCase() : "?"}
                    </div>
                    <span className="text-white font-semibold hover:text-pink-300 transition-colors">
                      {post.username || "Unknown User"}
                    </span>
                  </div>
                  <p className="text-white text-lg mb-4">{post.content}</p>
                  <p className="text-sm text-gray-500">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
