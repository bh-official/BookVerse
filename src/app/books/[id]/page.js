import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function SingleBookPage({ params }) {
  // get user (can be null if not logged in)
  const user = await getUser();

  // get the book id form the URL params
  const { id } = await params;

  // get the book from the database by its id
  const book = (await db.query(`SELECT * FROM books WHERE id = $1`, [id]))
    .rows[0];

  // if the book doesnt exist we could redirect or show a message
  const reviews = (
    await db.query(
      `
        SELECT review.id, review.content, review.user_id, user_account.username
        FROM review 
        JOIN user_account 
        ON review.user_id = user_account.id 
        WHERE review.book_id= $1;`,
      [id],
    )
  ).rows;

  async function handleSubmitReview(formData) {
    "use server";
    // extract content value from form
    const { content } = Object.fromEntries(formData);

    // get the currently logged in user details
    const user = await getUser();

    console.log(user);

    await db.query(
      `insert into review (user_id, book_id, content) values ($1, $2, $3)`,
      [user[0].id, id, content],
    );

    // redirect to same page so they can see the new review
    redirect(`/books/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex gap-8 mb-10">
        {book.img_url && (
          <img
            src={book.img_url}
            alt={book.title}
            className="w-48 aspect-[2/3] object-cover rounded shrink-0"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl">{book.title}</h1>
              <p className="opacity-60 mt-1">by {book.author}</p>
              {book.released && (
                <p className="text-sm opacity-40 mt-1">
                  {new Date(book.released).toLocaleDateString()}
                </p>
              )}
            </div>
            {book.user_id && user && book.user_id === user[0].id && (
              <div className="flex gap-2">
                <Link
                  href={`/books/${id}/edit`}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={async () => {
                    "use server";
                    await db.query(`DELETE FROM books WHERE id = $1`, [id]);
                    redirect(`/books`);
                  }}
                />
              </div>
            )}
          </div>
          {book.description && <p className="mt-4">{book.description}</p>}
          {book.quote && (
            <p className="mt-4 italic opacity-70">"{book.quote}"</p>
          )}
        </div>
      </div>

      <h2 className="text-xl mb-3">Leave a Review</h2>
      {user ? (
        <form className="mb-10" action={handleSubmitReview}>
          <textarea
            name="content"
            placeholder="Write your review..."
            required
            className="w-full border rounded p-3 resize-none h-24"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-black text-white rounded hover:opacity-80 transition-opacity cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mb-10 text-gray-500">
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>{" "}
          to leave a review
        </p>
      )}

      <h2 className="text-xl mb-3">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="opacity-50">No reviews yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <p className="font-medium">{review.username}</p>
                {review.user_id && user && review.user_id === user[0].id && (
                  <div className="flex gap-2">
                    <Link
                      href={`/books/${id}/review/${review.id}/edit`}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await db.query(`DELETE FROM review WHERE id = $1`, [
                          review.id,
                        ]);
                        redirect(`/books/${id}`);
                      }}
                      label="Delete"
                    />
                  </div>
                )}
              </div>
              <p className="opacity-70 mt-1">{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
