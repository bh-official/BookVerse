import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewBookPage() {
  const user = await getUser();

  async function handleAddBook(formData) {
    "use server";
    const { title, author, description, quote, released, img_url } =
      Object.fromEntries(formData);
    const user = await getUser();
    const result = await db.query(
      `INSERT INTO books (user_id, title, author, description, quote, released, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [user[0].id, title, author, description, quote, released, img_url],
    );
    redirect(`/books/${result.rows[0].id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/books"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to Books
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Add a New Book</h1>

          <form action={handleAddBook} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Book Title *</label>
              <input
                name="title"
                placeholder="Enter book title"
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Author *</label>
              <input
                name="author"
                placeholder="Enter author name"
                required
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Enter book description"
                rows={4}
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Memorable Quote</label>
              <input
                name="quote"
                placeholder="Enter a memorable quote"
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Release Date</label>
              <input
                name="released"
                type="date"
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Cover Image URL</label>
              <input
                name="img_url"
                placeholder="https://example.com/cover.jpg"
                className="w-full border border-white/20 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500 transition-colors mt-6"
            >
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
