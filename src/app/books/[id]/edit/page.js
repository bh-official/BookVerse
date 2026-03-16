import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCategories } from "@/utils/categories";

export const dynamic = "force-dynamic";

export default async function EditBookPage({ params }) {
  const user = await getUser();
  const { id } = await params;

  const book = (await db.query(`SELECT * FROM books WHERE id = $1`, [id]))
    .rows[0];

  // Fetch dynamic categories from database
  const categories = await getCategories();

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Book not found</p>
          <Link href="/books" className="text-purple-400 hover:text-purple-300">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  if (book.user_id !== user[0].id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">
            You are not authorized to edit this book.
          </p>
          <Link
            href={`/books/${id}`}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Book
          </Link>
        </div>
      </div>
    );
  }

  async function handleUpdateBook(formData) {
    "use server";
    const {
      title,
      author,
      description,
      quote,
      released,
      img_url,
      category,
      newCategory,
    } = Object.fromEntries(formData);

    // Use newCategory if provided, otherwise use selected category
    const finalCategory = newCategory?.trim() || category || null;

    // Validate - trim whitespace and check if empty
    const trimmedTitle = title?.trim();
    const trimmedAuthor = author?.trim();

    if (!trimmedTitle || trimmedTitle.length === 0) {
      return { error: "Title cannot be empty" };
    }

    if (!trimmedAuthor || trimmedAuthor.length === 0) {
      return { error: "Author cannot be empty" };
    }

    await db.query(
      `UPDATE books SET title = $1, author = $2, description = $3, quote = $4, released = $5, img_url = $6, category = $7 WHERE id = $8`,
      [
        trimmedTitle,
        trimmedAuthor,
        description?.trim() || null,
        quote?.trim() || null,
        released || null,
        img_url?.trim() || null,
        finalCategory,
        id,
      ],
    );
    redirect(`/books/${id}`);
  }

  async function handleDeleteBook() {
    "use server";
    await db.query(`DELETE FROM books WHERE id = $1`, [id]);
    redirect(`/books`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href={`/books/${id}`}
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to book
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Book</h1>

          <form action={handleUpdateBook} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Title
              </label>
              <input
                name="title"
                defaultValue={book.title}
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Author
              </label>
              <input
                name="author"
                defaultValue={book.author}
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Category
              </label>
              <div className="space-y-2">
                <select
                  name="category"
                  defaultValue={book.category || ""}
                  className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="" className="bg-slate-800 text-gray-400">
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-slate-800 text-white"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm text-center">
                  — or type a new category below —
                </p>
                <input
                  name="newCategory"
                  placeholder="Enter new category name"
                  className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={book.description || ""}
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 h-24 text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Memorable Quote
              </label>
              <input
                name="quote"
                defaultValue={book.quote || ""}
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Release Date
              </label>
              <input
                name="released"
                type="date"
                defaultValue={
                  book.released
                    ? new Date(book.released).toISOString().split("T")[0]
                    : ""
                }
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Cover Image URL
              </label>
              <input
                name="img_url"
                defaultValue={book.img_url || ""}
                className="w-full border border-white/20 bg-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
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
                href={`/books/${id}`}
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <form action={handleDeleteBook}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete Book
                </button>
              </form>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
