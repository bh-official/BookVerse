import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditReviewPage({ params }) {
  // make sure user is logged in
  const user = await getUser();

  // get the params
  const { id: bookId, reviewId } = await params;

  // get the review from the database
  const review = (
    await db.query(`SELECT * FROM review WHERE id = $1`, [reviewId])
  ).rows[0];

  // if the review doesn't exist, show not found
  if (!review) {
    return (
      <div className="p-6">
        <p>Review not found.</p>
        <Link
          href={`/books/${bookId}`}
          className="text-blue-500 hover:underline"
        >
          Back to book
        </Link>
      </div>
    );
  }

  // check if the current user owns this review
  if (review.user_id !== user[0].id) {
    return (
      <div className="p-6">
        <p>You are not authorized to edit this review.</p>
        <Link
          href={`/books/${bookId}`}
          className="text-blue-500 hover:underline"
        >
          Back to book
        </Link>
      </div>
    );
  }

  async function handleUpdateReview(formData) {
    "use server";
    // pull the content from the form data
    const { content } = Object.fromEntries(formData);

    // update the review in the database
    await db.query(`UPDATE review SET content = $1 WHERE id = $2`, [
      content,
      reviewId,
    ]);

    // redirect to the book's page
    redirect(`/books/${bookId}`);
  }

  async function handleDeleteReview() {
    "use server";
    // delete the review from the database
    await db.query(`DELETE FROM review WHERE id = $1`, [reviewId]);

    // redirect to the book's page
    redirect(`/books/${bookId}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/books/${bookId}`}
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back to book
        </Link>
      </div>

      <h1 className="text-2xl mb-6">Edit Review</h1>

      <form action={handleUpdateReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea
            name="content"
            defaultValue={review.content}
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
            href={`/books/${bookId}`}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-8 pt-4 border-t">
        <form action={handleDeleteReview}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this review?")) {
                e.preventDefault();
              }
            }}
          >
            Delete Review
          </button>
        </form>
      </div>
    </div>
  );
}
