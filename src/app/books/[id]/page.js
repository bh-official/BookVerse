import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function SingleBookPage({ params }) {
  const user = await getUser();
  const { id } = await params;

  // Validate that id is a number BEFORE querying the database
  const bookId = parseInt(id);
  if (isNaN(bookId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Invalid Book Link
            </h1>
            <p className="text-gray-400 mb-6">
              The book link you're trying to access appears to be invalid.
              Please check the URL and try again.
            </p>
            <Link
              href="/books"
              className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
            >
              Browse Books
            </Link>
          </div>
          <Link
            href="/books"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Go back to Books
          </Link>
        </div>
      </div>
    );
  }

  const book = (await db.query(`SELECT * FROM books WHERE id = $1`, [bookId]))
    .rows[0];

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Book Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              Sorry, we couldn't find the book you're looking for. It may have
              been removed from our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/books"
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
              >
                Browse Books
              </Link>
              <Link
                href="/books/new"
                className="px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Add a Book
              </Link>
            </div>
          </div>
          <Link
            href="/books"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Go back to Books
          </Link>
        </div>
      </div>
    );
  }

  const reviews = (
    await db.query(
      `
        SELECT review.id, review.content, review.user_id, user_account.username
        FROM review 
        JOIN user_account 
        ON review.user_id = user_account.id 
        WHERE review.book_id= $1;`,
      [bookId],
    )
  ).rows;

  async function handleSubmitReview(formData) {
    "use server";
    const { content } = Object.fromEntries(formData);

    // Validate - trim whitespace and check if empty
    const trimmedContent = content?.trim();

    if (!trimmedContent || trimmedContent.length === 0) {
      return { error: "Review cannot be empty" };
    }

    const user = await getUser();
    await db.query(
      `insert into review (user_id, book_id, content) values ($1, $2, $3)`,
      [user[0].id, bookId, trimmedContent],
    );
    redirect(`/books/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto p-6">
        <Link
          href="/books"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to Books
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="flex gap-8 mb-10">
            {book.img_url && (
              <img
                src={book.img_url}
                alt={book.title}
                className="w-48 aspect-[2/3] object-cover rounded-lg shrink-0 shadow-lg"
              />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {book.title}
                  </h1>
                  <p className="text-gray-400 mt-1">by {book.author}</p>
                  {book.category && (
                    <Link
                      href={`/categories/${encodeURIComponent(book.category)}`}
                      className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-purple-600/30 text-purple-300 rounded-full hover:bg-purple-600/50 transition-colors"
                    >
                      {book.category}
                    </Link>
                  )}
                  {book.released && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(book.released).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {book.user_id && user && book.user_id === user[0].id && (
                  <div className="flex gap-2">
                    <Link
                      href={`/books/${id}/edit`}
                      className="px-3 py-1 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await db.query(`DELETE FROM books WHERE id = $1`, [
                          bookId,
                        ]);
                        redirect(`/books`);
                      }}
                    />
                  </div>
                )}
              </div>
              {book.description && (
                <p className="mt-4 text-gray-300">{book.description}</p>
              )}
              {book.quote && (
                <p className="mt-4 italic text-gray-400">"{book.quote}"</p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-3">
            Leave a Review
          </h2>
          <form className="mb-10" action={handleSubmitReview}>
            <textarea
              name="content"
              placeholder="Write your review..."
              required
              className="w-full border border-white/20 bg-white/5 rounded p-3 resize-none h-24 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
            >
              Submit Review
            </button>
          </form>

          <h2 className="text-xl font-semibold text-white mb-3">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-white/10 pb-4">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-white">{review.username}</p>
                    {review.user_id &&
                      user &&
                      review.user_id === user[0].id && (
                        <div className="flex gap-2">
                          <Link
                            href={`/books/${id}/review/${review.id}/edit`}
                            className="text-sm text-purple-400 hover:text-purple-300"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={async () => {
                              "use server";
                              await db.query(
                                `DELETE FROM review WHERE id = $1`,
                                [review.id],
                              );
                              redirect(`/books/${id}`);
                            }}
                            label="Delete"
                          />
                        </div>
                      )}
                  </div>
                  <p className="text-gray-400 mt-1">{review.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
