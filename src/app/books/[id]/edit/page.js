import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditBookPage({ params }) {
  // make sure user is logged in
  const user = await getUser();

  // get the book id from the URL params
  const { id } = await params;

  // get the book from the database by its id
  const book = (await db.query(`SELECT * FROM books WHERE id = $1`, [id]))
    .rows[0];

  // if the book doesn't exist, show not found
  if (!book) {
    return (
      <div className="p-6">
        <p>Book not found.</p>
        <Link href="/books" className="text-blue-500 hover:underline">
          Back to books
        </Link>
      </div>
    );
  }

  // check if the current user owns this book
  if (book.user_id !== user[0].id) {
    return (
      <div className="p-6">
        <p>You are not authorized to edit this book.</p>
        <Link href={`/books/${id}`} className="text-blue-500 hover:underline">
          Back to book
        </Link>
      </div>
    );
  }

  async function handleUpdateBook(formData) {
    "use server";
    // pull the fields from the form data
    const { title, author, description, quote, released, img_url } =
      Object.fromEntries(formData);

    // update the book in the database
    await db.query(
      `UPDATE books SET title = $1, author = $2, description = $3, quote = $4, released = $5, img_url = $6 WHERE id = $7`,
      [title, author, description, quote, released, img_url, id],
    );

    // redirect to the book's page
    redirect(`/books/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/books/${id}`}
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back to book
        </Link>
      </div>

      <h1 className="text-2xl mb-6">Edit Book</h1>

      <form action={handleUpdateBook} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            defaultValue={book.title}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            name="author"
            defaultValue={book.author}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={book.description || ""}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Memorable Quote
          </label>
          <input
            name="quote"
            defaultValue={book.quote || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Release Date</label>
          <input
            name="released"
            type="date"
            defaultValue={
              book.released
                ? new Date(book.released).toISOString().split("T")[0]
                : ""
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image URL
          </label>
          <input
            name="img_url"
            defaultValue={book.img_url || ""}
            className="w-full border rounded px-3 py-2"
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
            href={`/books/${id}`}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
