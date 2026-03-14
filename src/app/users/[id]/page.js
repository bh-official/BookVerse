import { getUser } from "@/utils/getUser";
import { db } from "@/utils/db";
import Link from "next/link";

export default async function UserPage({ params }) {
  const { id } = await params;

  // Fetch the user by ID from the database
  const userResult = await db.query(
    `SELECT * FROM user_account WHERE id = $1`,
    [id],
  );
  const user = userResult.rows;

  if (user.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <Link href="/posts" className="text-purple-400 hover:text-purple-300">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  const reviews = (
    await db.query(
      `
        select review.*, books.title 
        FROM review
        JOIN books 
        ON review.book_id = books.id
        WHERE review.user_id = $1
    `,
      [id],
    )
  ).rows;

  const posts = (
    await db.query(
      `SELECT * FROM postss WHERE user_id = $1 ORDER BY created_at DESC`,
      [id],
    )
  ).rows;

  // Get current logged in user to check if this is their profile
  const currentUser = await getUser();
  const isOwnProfile = currentUser && currentUser[0].id === id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/posts"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          ← Back to Posts
        </Link>

        {/* User Profile Header */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user[0].username ? user[0].username[0].toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user[0].username}
              </h1>
              <p className="text-gray-400">{user[0].bio || "No bio yet"}</p>
            </div>
          </div>
          {isOwnProfile && (
            <Link
              href="/users/you"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300 text-sm"
            >
              ← Edit your profile
            </Link>
          )}
        </div>

        {/* Posts Section */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-white/10 pb-4 last:border-0"
                >
                  <p className="text-white">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-white/10 pb-4 last:border-0"
                >
                  <Link
                    href={`/books/${review.book_id}`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    <strong className="text-lg text-white">
                      {review.title}
                    </strong>
                  </Link>
                  <p className="text-gray-400 mt-2">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
