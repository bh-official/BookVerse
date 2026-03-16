import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/books - Get all books
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let books;
    if (category) {
      books = (
        await db.query(`SELECT * FROM books WHERE category = $1`, [category])
      ).rows;
    } else {
      books = (await db.query(`SELECT * FROM books`)).rows;
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}

// POST /api/books - Create a new book
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;
    const { title, author, description, quote, released, img_url, category } =
      await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!author || author.trim().length === 0) {
      return NextResponse.json(
        { error: "Author is required" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `INSERT INTO books (user_id, title, author, description, quote, released, img_url, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        userIdDb,
        title.trim(),
        author.trim(),
        description?.trim() || null,
        quote?.trim() || null,
        released || null,
        img_url || null,
        category || null,
      ],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 },
    );
  }
}
