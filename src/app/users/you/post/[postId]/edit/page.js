import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditPostPage({ params }) {
  const user = await getUser();
  const { postId } = await params;

  const post = (await db.query(`SELECT * FROM postss WHERE id = $1`, [postId]))
    .rows[0];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Post not found</p>
          <Link
            href="/users/you"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (post.user_id !== user[0].id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">
            You are not authorized to edit this post.
          </p>
          <Link
            href="/users/you"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  async function handleUpdatePost(formData) {
    "use server";
    const { content } = Object.fromEntries(formData);

    // Validate - trim whitespace and check if empty
    const trimmedContent = content?.trim();

    if (!trimmedContent || trimmedContent.length === 0) {
      return { error: "Post content cannot be empty" };
    }

    await db.query(`UPDATE postss SET content = $1 WHERE id = $2`, [
      trimmedContent,
      postId,
    ]);
    redirect("/users/you");
  }

  async function handleDeletePost() {
    "use server";
    await db.query(`DELETE FROM postss WHERE id = $1`, [postId]);
    redirect("/users/you");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/users/you"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to profile
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Post</h1>

          <form action={handleUpdatePost} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Your Post
              </label>
              <textarea
                name="content"
                defaultValue={post.content}
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 h-32 resize-none text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                Save Changes
              </button>
              <Link
                href="/users/you"
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <form action={handleDeletePost}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
