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

  // Get user account ID from clerk_id
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

  // fetch our reviews
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

  // Fetch posts
  const posts = (
    await db.query(
      `SELECT * FROM postss WHERE user_id = $1 ORDER BY created_at DESC`,
      [user[0].id],
    )
  ).rows;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{user[0].username}</h1>
        <p className="text-gray-600 mb-4">{user[0].bio || "No bio yet"}</p>
      </div>

      {/* Create Post Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <form action={createPost} className="space-y-4">
          <textarea
            name="content"
            placeholder="What's on your mind?"
            className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:ring-opacity-50"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-[#6c47ff] text-white rounded-full font-semibold py-2 px-6 hover:bg-[#5a3ce6] transition-colors"
          >
            Post
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <p className="text-gray-800">{post.content}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/users/you/post/${post.id}/edit`}
                      className="text-sm text-blue-500 hover:underline"
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
                <p className="text-sm text-gray-400 mt-2">
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">You haven't reviewed anything yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <Link
                  href={`/books/${review.book_id}`}
                  className="hover:text-[#6c47ff] transition-colors"
                >
                  <strong className="text-lg">{review.title}</strong>
                </Link>
                <p className="text-gray-600 mt-2">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
