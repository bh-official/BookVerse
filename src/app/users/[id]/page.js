import { getUser } from "@/utils/getUser";
import { db } from "@/utils/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import LikeButton from "@/components/LikeButton";
import { getAvatarColor } from "@/utils/categories";

async function followUser(formData) {
  "use server";
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const followingId = parseInt(formData.get("followingId"));

  const currentUser = await getUser();
  if (!currentUser || currentUser[0].id === followingId) return;

  try {
    await db.query(
      `INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [currentUser[0].id, followingId],
    );
  } catch (e) {
    // Ignore conflict errors
  }

  redirect(`/users/${followingId}`);
}

async function unfollowUser(formData) {
  "use server";
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const followingId = parseInt(formData.get("followingId"));

  const currentUser = await getUser();
  if (!currentUser || currentUser[0].id === followingId) return;

  await db.query(
    `DELETE FROM followers WHERE follower_id = $1 AND following_id = $2`,
    [currentUser[0].id, followingId],
  );

  redirect(`/users/${followingId}`);
}

export default async function UserPage({ params }) {
  const { id } = await params;

  // Validate that id is a number
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Invalid Profile Link
            </h1>
            <p className="text-gray-400 mb-6">
              The profile link you're trying to access appears to be invalid.
              Please check the URL and try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/posts"
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
              >
                Browse Posts
              </Link>
              <Link
                href="/books"
                className="px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Books
              </Link>
            </div>
          </div>
          <Link
            href="/posts"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Go back to Posts
          </Link>
        </div>
      </div>
    );
  }

  // Fetch the user by ID from the database
  const userResult = await db.query(
    `SELECT * FROM user_account WHERE id = $1`,
    [userId],
  );
  const user = userResult.rows;

  if (user.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              User Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              Sorry, we couldn't find the user you're looking for. The profile
              may have been deleted or the URL might be incorrect.
            </p>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <p className="text-yellow-200 text-sm">
                Looking for someone specific? Try browsing the posts page to
                find other book lovers!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/posts"
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
              >
                Browse Posts
              </Link>
              <Link
                href="/books"
                className="px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Books
              </Link>
            </div>
          </div>
          <Link
            href="/posts"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Go back to Posts
          </Link>
        </div>
      </div>
    );
  }

  // Get follower and following counts
  const followerCount = (
    await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE following_id = $1`,
      [userId],
    )
  ).rows[0].count;

  const followingCount = (
    await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE follower_id = $1`,
      [userId],
    )
  ).rows[0].count;

  // Check if current user is following this user
  const currentUser = await getUser();
  let isFollowing = false;
  if (currentUser) {
    const followResult = await db.query(
      `SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2`,
      [currentUser[0].id, userId],
    );
    isFollowing = followResult.rows.length > 0;
  }

  const isOwnProfile = currentUser && currentUser[0].id === userId;

  const reviews = (
    await db.query(
      `
        select review.*, books.title 
        FROM review
        JOIN books 
        ON review.book_id = books.id
        WHERE review.user_id = $1
    `,
      [userId],
    )
  ).rows;

  const posts = (
    await db.query(
      `SELECT * FROM postss WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    )
  ).rows;

  // Get like counts for posts
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

    // Check if current user has liked these posts
    if (currentUser) {
      const userLikesResult = await db.query(
        `SELECT post_id FROM post_likes WHERE user_id = $1 AND post_id = ANY($2)`,
        [currentUser[0].id, postIds],
      );
      userLikesResult.rows.forEach((row) => {
        userLikes[row.post_id] = true;
      });
    }
  }

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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${getAvatarColor(user[0].username || "")} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
              >
                {user[0].username ? user[0].username[0].toUpperCase() : "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user[0].username}
                </h1>
                <p className="text-gray-400">{user[0].bio || "No bio yet"}</p>
              </div>
            </div>
          </div>

          {/* Follower Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <span className="block text-white font-bold text-lg">
                {followerCount}
              </span>
              <span className="text-gray-400 text-sm">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-white font-bold text-lg">
                {followingCount}
              </span>
              <span className="text-gray-400 text-sm">Following</span>
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {!isOwnProfile && currentUser && (
            <div className="mt-4">
              {isFollowing ? (
                <form action={unfollowUser}>
                  <input type="hidden" name="followingId" value={userId} />
                  <button
                    type="submit"
                    className="px-6 py-2 border-2 border-purple-500 text-purple-400 rounded-full font-semibold hover:bg-purple-500/20 transition-colors"
                  >
                    Unfollow
                  </button>
                </form>
              ) : (
                <form action={followUser}>
                  <input type="hidden" name="followingId" value={userId} />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
                  >
                    Follow
                  </button>
                </form>
              )}
            </div>
          )}

          {isOwnProfile && (
            <Link
              href="/users/you"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300 text-sm"
            >
              ← Edit your profile
            </Link>
          )}

          {!currentUser && !isOwnProfile && (
            <div className="mt-4 text-gray-400 text-sm">
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </Link>{" "}
              to follow this user
            </div>
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
                  <div className="flex items-center gap-4 mt-2">
                    <LikeButton
                      postId={post.id}
                      initialLiked={!!userLikes[post.id]}
                      likeCount={likeCounts[post.id] || 0}
                      isLoggedIn={!!currentUser}
                    />
                  </div>
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
