import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditReviewPage({ params }) {
  const user = await getUser();
  const { id: bookId, reviewId } = await params;

  const review = (
    await db.query(`SELECT * FROM review WHERE id = $1`, [reviewId])
  ).rows[0];

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Review not found</p>
          <Link
            href={`/books/${bookId}`}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Book
          </Link>
        </div>
      </div>
    );
  }

  if (review.user_id !== user[0].id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">
            You are not authorized to edit this review.
          </p>
          <Link
            href={`/books/${bookId}`}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Book
          </Link>
        </div>
      </div>
    );
  }

  async function handleUpdateReview(formData) {
    "use server";
    const { content } = Object.fromEntries(formData);

    // Validate - trim whitespace and check if empty
    const trimmedContent = content?.trim();

    if (!trimmedContent || trimmedContent.length === 0) {
      return { error: "Review cannot be empty" };
    }

    await db.query(`UPDATE review SET content = $1 WHERE id = $2`, [
      trimmedContent,
      reviewId,
    ]);
    redirect(`/books/${bookId}`);
  }

  async function handleDeleteReview() {
    "use server";
    await db.query(`DELETE FROM review WHERE id = $1`, [reviewId]);
    redirect(`/books/${bookId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href={`/books/${bookId}`}
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to book
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Review</h1>

          <form action={handleUpdateReview} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                name="content"
                defaultValue={review.content}
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
                href={`/books/${bookId}`}
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <form action={handleDeleteReview}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
