import { db } from "@/utils/db";
import Link from "next/link";
import {
  BOOK_CATEGORIES,
  getCategoryEmoji,
  isValidCategory,
} from "@/utils/categories";
import InvalidLink from "@/components/InvalidLink";
import NotFound from "@/components/NotFound";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  if (!isValidCategory(decodedCategory)) {
    return { title: "Invalid Category - BookVerse" };
  }

  const result = await db.query(
    `SELECT COUNT(*) as count FROM books WHERE category = $1`,
    [decodedCategory],
  );
  const bookCount = parseInt(result.rows[0]?.count || 0);

  return {
    title: `${decodedCategory} Books - BookVerse`,
    description: `Browse ${bookCount} ${decodedCategory} books on BookVerse`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  if (!isValidCategory(decodedCategory)) {
    return (
      <InvalidLink
        title="Invalid Category Link"
        message={`The category "${decodedCategory}" does not exist in our system.`}
        emoji="⚠️"
      />
    );
  }

  const booksResult = await db.query(
    `SELECT * FROM books WHERE category = $1 ORDER BY id DESC`,
    [decodedCategory],
  );
  const books = booksResult.rows;

  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-pink-500 mb-4">📚</h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            No Books in This Category
          </h2>
          <p className="text-gray-400 mb-8">
            There are no books in the "{decodedCategory}" category yet.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/categories"
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
            >
              Browse Categories
            </Link>
            <Link
              href="/books/new"
              className="px-6 py-3 border-2 border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Add a Book
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <Link
          href="/categories"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to Categories
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {getCategoryEmoji(decodedCategory)} {decodedCategory}
            </h1>
            <p className="text-gray-400">
              {books.length} {books.length === 1 ? "book" : "books"} in this
              category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-500/50 transition-all">
                {book.img_url ? (
                  <div className="aspect-[2/3] relative">
                    <img
                      src={book.img_url}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/3] bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {book.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
