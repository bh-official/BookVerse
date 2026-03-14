import { db } from "@/utils/db";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // Check if valid category
  if (!BOOK_CATEGORIES.includes(decodedCategory)) {
    return {
      title: "Invalid Category - BookVerse",
    };
  }

  // Get book count for this category
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

  // Check if category is valid format (not a number or random string)
  // Categories should be valid category names from our list
  const isValidCategory = BOOK_CATEGORIES.includes(decodedCategory);

  if (!isValidCategory) {
    // Invalid category name - show invalid link page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-pink-500 mb-4">⚠️</h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Invalid Category Link
          </h2>
          <p className="text-gray-400 mb-8">
            The category "{decodedCategory}" does not exist in our system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/categories"
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
            >
              Browse Categories
            </Link>
            <Link
              href="/books"
              className="px-6 py-3 border-2 border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
            >
              All Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get books in this category
  const booksResult = await db.query(
    `SELECT * FROM books WHERE category = $1 ORDER BY id DESC`,
    [decodedCategory],
  );
  const books = booksResult.rows;

  // If no books in this category, show not found
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

        {books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No books in this category yet.
            </p>
          </div>
        ) : (
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
