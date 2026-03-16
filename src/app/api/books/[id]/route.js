import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/books/[id] - Get a single book
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const books = await db.query(`SELECT * FROM books WHERE id = $1`, [bookId]);

    if (books.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Get reviews for this book
    const reviews = await db.query(
      `SELECT review.id, review.content, review.user_id, user_account.username
       FROM review 
       JOIN user_account ON review.user_id = user_account.id 
       WHERE review.book_id = $1`,
      [bookId],
    );

    const book = books.rows[0];
    book.reviews = reviews.rows;

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 },
    );
  }
}

// PUT /api/books/[id] - Update a book
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if book exists and belongs to the user
    const existingBook = await db.query(`SELECT * FROM books WHERE id = $1`, [
      bookId,
    ]);

    if (existingBook.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (existingBook.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to update this book" },
        { status: 403 },
      );
    }

    const { title, author, description, quote, released, img_url, category } =
      await request.json();

    const result = await db.query(
      `UPDATE books 
       SET title = COALESCE($1, title), 
           author = COALESCE($2, author), 
           description = COALESCE($3, description), 
           quote = COALESCE($4, quote), 
           released = COALESCE($5, released), 
           img_url = COALESCE($6, img_url),
           category = COALESCE($7, category)
       WHERE id = $8 
       RETURNING *`,
      [
        title?.trim() || null,
        author?.trim() || null,
        description?.trim() || null,
        quote?.trim() || null,
        released || null,
        img_url || null,
        category || null,
        bookId,
      ],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 },
    );
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if book exists and belongs to the user
    const existingBook = await db.query(`SELECT * FROM books WHERE id = $1`, [
      bookId,
    ]);

    if (existingBook.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (existingBook.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to delete this book" },
        { status: 403 },
      );
    }

    // Delete reviews first
    await db.query(`DELETE FROM review WHERE book_id = $1`, [bookId]);

    // Delete book genres
    await db.query(`DELETE FROM book_genres WHERE book_id = $1`, [bookId]);

    // Delete the book
    await db.query(`DELETE FROM books WHERE id = $1`, [bookId]);

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 },
    );
  }
}
