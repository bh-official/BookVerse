import { db } from "@/utils/db";
import { NextResponse } from "next/server";

// GET /api/categories/[category] - Get books by category
export async function GET(request, { params }) {
  try {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    // Get all unique categories from database
    const categoriesResult = await db.query(
      `SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != ''`,
    );
    const validCategories = categoriesResult.rows.map((row) => row.category);

    // Validate category (case-sensitive match)
    if (!validCategories.includes(decodedCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const books = await db.query(`SELECT * FROM books WHERE category = $1`, [
      decodedCategory,
    ]);

    return NextResponse.json(books.rows);
  } catch (error) {
    console.error("Error fetching books by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch books by category" },
      { status: 500 },
    );
  }
}
