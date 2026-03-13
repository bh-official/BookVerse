import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import Link from "next/link";

export default async function BooksPage() {
  const user = await getUser();
  const books = (await db.query(`SELECT * FROM books`)).rows;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">All Books</h1>
          <Link
            href="/books/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
          >
            + Add a new book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              No books yet. Be the first to add one!
            </p>
            <Link
              href="/books/new"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
            >
              Add a Book
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <li key={book.id}>
                <Link href={`/books/${book.id}`} className="group block">
                  {book.img_url ? (
                    <img
                      src={book.img_url}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg group-hover:opacity-80 transition-opacity shadow-lg"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-white/10 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-white/20 transition-colors">
                      📚
                    </div>
                  )}
                  <h2 className="mt-3 text-sm font-medium text-white truncate">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-400 truncate">
                    {book.author}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
