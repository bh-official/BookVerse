import { getUser } from "@/utils/getUser";
import { db } from "@/utils/db";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

async function createPost(formData) {
  "use server";
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { content } = Object.fromEntries(formData);
  const userDetails = (
    await db.query(`SELECT id FROM user_account WHERE clerk_id = $1`, [userId])
  ).rows;

  if (userDetails.length > 0) {
    await db.query(`INSERT INTO posts (user_id, content) VALUES ($1, $2)`, [
      userDetails[0].id,
      content,
    ]);
  }

  revalidatePath("/users/you");
}

export default async function UserPage() {
  const user = await getUser();

  const reviews = (
    await db.query(
      `
            select review.*, books.title 
            FROM review
            JOIN books 
            ON review.book_id = books.id
            WHERE review.user_id = $1
        `,
      [user[0].id],
    )
  ).rows;

  const posts = (
    await db.query(
      `SELECT * FROM postss WHERE user_id = $1 ORDER BY created_at DESC`,
      [user[0].id],
    )
  ).rows;

  // Get follower and following counts
  const followerCount = (
    await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE following_id = $1`,
      [user[0].id],
    )
  ).rows[0].count;

  const followingCount = (
    await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE follower_id = $1`,
      [user[0].id],
    )
  ).rows[0].count;

  async function handleUpdateProfile(formData) {
    "use server";
    const { username, bio } = Object.fromEntries(formData);
    await db.query(
      `UPDATE user_account SET username = $1, bio = $2 WHERE id = $3`,
      [username, bio, user[0].id],
    );
    redirect("/users/you");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user[0].username}
              </h1>
              <p className="text-gray-400">{user[0].bio || "No bio yet"}</p>
            </div>
            <details className="relative">
              <summary className="cursor-pointer text-gray-400 hover:text-white">
                ⋮
              </summary>
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-lg shadow-lg p-4 z-10">
                <form action={handleUpdateProfile} className="space-y-3">
                  <div>
                    <label className="block text-white text-sm mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      defaultValue={user[0].username}
                      className="w-full border border-white/20 bg-white/5 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Bio</label>
                    <textarea
                      name="bio"
                      defaultValue={user[0].bio || ""}
                      placeholder="Tell us about yourself"
                      className="w-full border border-white/20 bg-white/5 rounded px-3 py-2 text-white text-sm h-20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white rounded py-2 text-sm hover:bg-purple-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </details>
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
        </div>

        {/* Create Post Form */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create a Post
          </h2>
          <form action={createPost} className="space-y-4">
            <textarea
              name="content"
              placeholder="What's on your mind?"
              className="w-full p-4 border border-white/20 bg-white/5 rounded-xl resize-none text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white rounded-full font-semibold py-2 px-6 hover:bg-purple-500 transition-colors"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts Section */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">You haven't posted anything yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-white/10 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-white">{post.content}</p>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/users/you/post/${post.id}/edit`}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await db.query(`DELETE FROM postss WHERE id = $1`, [
                            post.id,
                          ]);
                          redirect("/users/you");
                        }}
                        label="Delete"
                      />
                    </div>
                  </div>
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
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">You haven't reviewed anything yet</p>
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
