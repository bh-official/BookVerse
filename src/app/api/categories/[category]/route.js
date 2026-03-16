import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { isValidCategory } from "@/utils/categories";

// GET /api/categories/[category] - Get books by category
export async function GET(request, { params }) {
  try {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    // Validate category
    if (!isValidCategory(decodedCategory)) {
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
