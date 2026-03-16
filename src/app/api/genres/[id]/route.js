import { db } from "@/utils/db";
import { NextResponse } from "next/server";

// GET /api/genres/[id] - Get a single genre
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const genreId = parseInt(id);

    if (isNaN(genreId)) {
      return NextResponse.json({ error: "Invalid genre ID" }, { status: 400 });
    }

    const genre = await db.query(`SELECT * FROM genres WHERE id = $1`, [
      genreId,
    ]);

    if (genre.rows.length === 0) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Get books in this genre
    const books = await db.query(
      `SELECT books.* FROM books 
       JOIN book_genres ON books.id = book_genres.book_id 
       WHERE book_genres.genre_id = $1`,
      [genreId],
    );

    const result = genre.rows[0];
    result.books = books.rows;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching genre:", error);
    return NextResponse.json(
      { error: "Failed to fetch genre" },
      { status: 500 },
    );
  }
}

// PUT /api/genres/[id] - Update a genre
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const genreId = parseInt(id);

    if (isNaN(genreId)) {
      return NextResponse.json({ error: "Invalid genre ID" }, { status: 400 });
    }

    const { name, description } = await request.json();

    // Check if genre exists
    const existingGenre = await db.query(`SELECT * FROM genres WHERE id = $1`, [
      genreId,
    ]);

    if (existingGenre.rows.length === 0) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Check if new name already exists
    if (
      name &&
      name.trim().toLowerCase() !== existingGenre.rows[0].name.toLowerCase()
    ) {
      const duplicateGenre = await db.query(
        `SELECT * FROM genres WHERE LOWER(name) = LOWER($1) AND id != $2`,
        [name.trim(), genreId],
      );

      if (duplicateGenre.rows.length > 0) {
        return NextResponse.json(
          { error: "Genre name already exists" },
          { status: 409 },
        );
      }
    }

    const result = await db.query(
      `UPDATE genres 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description)
       WHERE id = $3 
       RETURNING *`,
      [name?.trim() || null, description?.trim() || null, genreId],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating genre:", error);
    return NextResponse.json(
      { error: "Failed to update genre" },
      { status: 500 },
    );
  }
}

// DELETE /api/genres/[id] - Delete a genre
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const genreId = parseInt(id);

    if (isNaN(genreId)) {
      return NextResponse.json({ error: "Invalid genre ID" }, { status: 400 });
    }

    // Check if genre exists
    const existingGenre = await db.query(`SELECT * FROM genres WHERE id = $1`, [
      genreId,
    ]);

    if (existingGenre.rows.length === 0) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Delete genre associations first
    await db.query(`DELETE FROM book_genres WHERE genre_id = $1`, [genreId]);

    // Delete the genre
    await db.query(`DELETE FROM genres WHERE id = $1`, [genreId]);

    return NextResponse.json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error("Error deleting genre:", error);
    return NextResponse.json(
      { error: "Failed to delete genre" },
      { status: 500 },
    );
  }
}
