import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { BOOK_CATEGORIES } from "@/utils/categories";

// GET /api/categories - Get all categories with book counts
export async function GET(request) {
  try {
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

    return NextResponse.json({
      categories: activeCategories,
      allCategories: categoryCounts,
      totalBooks,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
