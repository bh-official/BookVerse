import { db } from "@/utils/db";
import { NextResponse } from "next/server";

// GET /api/categories - Get all categories with book counts
export async function GET(request) {
  try {
    // Fetch all unique categories with their counts from books table
    const result = await db.query(
      `SELECT category, COUNT(*) as count FROM books 
       WHERE category IS NOT NULL AND category != '' 
       GROUP BY category 
       ORDER BY category`,
    );

    const categoryCounts = result.rows.map((row) => ({
      name: row.category,
      count: parseInt(row.count),
    }));

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
