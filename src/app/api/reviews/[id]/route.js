import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PUT /api/reviews/[id] - Update a review
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if review exists and belongs to the user
    const existingReview = await db.query(
      `SELECT * FROM review WHERE id = $1`,
      [reviewId],
    );

    if (existingReview.rows.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to update this review" },
        { status: 403 },
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Review content cannot be empty" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `UPDATE review SET content = $1 WHERE id = $2 RETURNING *`,
      [content.trim(), reviewId],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if review exists and belongs to the user
    const existingReview = await db.query(
      `SELECT * FROM review WHERE id = $1`,
      [reviewId],
    );

    if (existingReview.rows.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to delete this review" },
        { status: 403 },
      );
    }

    await db.query(`DELETE FROM review WHERE id = $1`, [reviewId]);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
