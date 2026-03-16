import { db } from "@/utils/db";
import { NextResponse } from "next/server";

// GET /api/genres - Get all genres
export async function GET(request) {
  try {
    const genres = await db.query(`SELECT * FROM genres ORDER BY name`);

    // Get book counts for each genre
    const genreIds = genres.rows.map((g) => g.id);
    let bookCounts = {};

    if (genreIds.length > 0) {
      const bookCountsResult = await db.query(
        `SELECT genre_id, COUNT(*) as count FROM book_genres WHERE genre_id = ANY($1) GROUP BY genre_id`,
        [genreIds],
      );
      bookCountsResult.rows.forEach((row) => {
        bookCounts[row.genre_id] = parseInt(row.count);
      });
    }

    // Add book counts to genres
    const genresWithCounts = genres.rows.map((genre) => ({
      ...genre,
      bookCount: bookCounts[genre.id] || 0,
    }));

    return NextResponse.json(genresWithCounts);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 },
    );
  }
}

// POST /api/genres - Create a new genre
export async function POST(request) {
  try {
    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Genre name is required" },
        { status: 400 },
      );
    }

    // Check if genre already exists
    const existingGenre = await db.query(
      `SELECT * FROM genres WHERE LOWER(name) = LOWER($1)`,
      [name.trim()],
    );

    if (existingGenre.rows.length > 0) {
      return NextResponse.json(
        { error: "Genre already exists" },
        { status: 409 },
      );
    }

    const result = await db.query(
      `INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING *`,
      [name.trim(), description?.trim() || null],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating genre:", error);
    return NextResponse.json(
      { error: "Failed to create genre" },
      { status: 500 },
    );
  }
}
