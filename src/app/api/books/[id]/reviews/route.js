import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/books/[id]/reviews - Get all reviews for a book
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const reviews = await db.query(
      `SELECT review.id, review.content, review.user_id, review.created_at, user_account.username
       FROM review 
       JOIN user_account ON review.user_id = user_account.id 
       WHERE review.book_id = $1
       ORDER BY review.created_at DESC`,
      [bookId],
    );

    return NextResponse.json(reviews.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST /api/books/[id]/reviews - Create a new review for a book
export async function POST(request, { params }) {
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
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Review content cannot be empty" },
        { status: 400 },
      );
    }

    // Check if book exists
    const book = await db.query(`SELECT * FROM books WHERE id = $1`, [bookId]);

    if (book.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const result = await db.query(
      `INSERT INTO review (user_id, book_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [userIdDb, bookId, content.trim()],
    );

    // Get username
    const userResult = await db.query(
      `SELECT username FROM user_account WHERE id = $1`,
      [userIdDb],
    );

    return NextResponse.json(
      {
        ...result.rows[0],
        username: userResult.rows[0]?.username,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
