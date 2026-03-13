import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditPostPage({ params }) {
  // make sure user is logged in
  const user = await getUser();

  // get the post id from the URL params
  const { postId } = await params;

  // get the post from the database
  const post = (await db.query(`SELECT * FROM postss WHERE id = $1`, [postId]))
    .rows[0];

  // if the post doesn't exist, show not found
  if (!post) {
    return (
      <div className="p-6">
        <p>Post not found.</p>
        <Link href="/users/you" className="text-blue-500 hover:underline">
          Back to profile
        </Link>
      </div>
    );
  }

  // check if the current user owns this post
  if (post.user_id !== user[0].id) {
    return (
      <div className="p-6">
        <p>You are not authorized to edit this post.</p>
        <Link href="/users/you" className="text-blue-500 hover:underline">
          Back to profile
        </Link>
      </div>
    );
  }

  async function handleUpdatePost(formData) {
    "use server";
    // pull the content from the form data
    const { content } = Object.fromEntries(formData);

    // update the post in the database
    await db.query(`UPDATE postss SET content = $1 WHERE id = $2`, [
      content,
      postId,
    ]);

    // redirect to the user's profile
    redirect("/users/you");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/users/you"
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back to profile
        </Link>
      </div>

      <h1 className="text-2xl mb-6">Edit Post</h1>

      <form action={handleUpdatePost} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Post</label>
          <textarea
            name="content"
            defaultValue={post.content}
            required
            className="w-full border rounded px-3 py-2 h-32 resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:opacity-80 transition-opacity cursor-pointer"
          >
            Save Changes
          </button>
          <Link
            href="/users/you"
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
