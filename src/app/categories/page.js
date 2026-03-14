import { db } from "@/utils/db";
import Link from "next/link";
import { Metadata } from "next";

export const metadata = {
  title: "Categories - BookVerse",
  description: "Browse books by category on BookVerse",
};

const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Horror",
  "Fantasy",
  "Comedy",
  "Jokes",
  "Funny",
  "Children",
  "Romance",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Drama",
  "Adventure",
  "Crime",
  "Dystopian",
];

export default async function CategoriesPage() {
  // Get book count for each category
  const categoryCounts = await Promise.all(
    BOOK_CATEGORIES.map(async (category) => {
      const result = await db.query(
        `SELECT COUNT(*) as count FROM books WHERE category = $1`,
        [category],
      );
      return {
        name: category,
        count: parseInt(result.rows[0]?.count || 0),
      };
    }),
  );

  // Get total book count
  const totalResult = await db.query(`SELECT COUNT(*) as count FROM books`);
  const totalBooks = parseInt(totalResult.rows[0]?.count || 0);

  // Get categories that have books
  const activeCategories = categoryCounts.filter((cat) => cat.count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/books"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to Books
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">
          Browse Categories
        </h1>
        <p className="text-gray-400 mb-8">
          Explore books by category. Total: {totalBooks} books in the library.
        </p>

        {/* All Books */}
        <Link href="/books" className="block mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">All Books</h2>
                <p className="text-white/80">View all books in the library</p>
              </div>
              <div className="text-4xl font-bold text-white">{totalBooks}</div>
            </div>
          </div>
        </Link>

        {/* Category Grid */}
        {activeCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No categorized books yet. Add some books with categories!
            </p>
            <Link
              href="/books/new"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
            >
              Add a Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeCategories.map((category) => (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {getCategoryEmoji(category.name)}
                    </span>
                    <span className="text-2xl font-bold text-purple-400">
                      {category.count}
                    </span>
                  </div>
                  <h3 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {category.count === 1 ? "book" : "books"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Inactive Categories Section */}
        {categoryCounts.filter((c) => c.count === 0).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">
              Categories Without Books
            </h2>
            <div className="flex flex-wrap gap-2">
              {categoryCounts
                .filter((cat) => cat.count === 0)
                .map((category) => (
                  <span
                    key={category.name}
                    className="px-3 py-1 bg-white/5 text-gray-500 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryEmoji(category) {
  const emojiMap = {
    Fiction: "📖",
    "Non-Fiction": "📚",
    Horror: "👻",
    Fantasy: "🧙",
    Comedy: "😂",
    Jokes: "🤣",
    Funny: "😄",
    Children: "👶",
    Romance: "💕",
    Mystery: "🔍",
    Thriller: "😱",
    "Science Fiction": "🚀",
    Biography: "👤",
    History: "🏛️",
    "Self-Help": "💡",
    Poetry: "📝",
    Drama: "🎭",
    Adventure: "⚔️",
    Crime: "🔪",
    Dystopian: "🌆",
  };
  return emojiMap[category] || "📕";
}
