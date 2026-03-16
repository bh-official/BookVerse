import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/users/[id] - Get a single user
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userResult = await db.query(
      `SELECT id, username, bio, clerk_id FROM user_account WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Get follower count
    const followerCountResult = await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE following_id = $1`,
      [userId],
    );
    user.followerCount = parseInt(followerCountResult.rows[0].count);

    // Get following count
    const followingCountResult = await db.query(
      `SELECT COUNT(*) as count FROM followers WHERE follower_id = $1`,
      [userId],
    );
    user.followingCount = parseInt(followingCountResult.rows[0].count);

    // Get user's posts
    const postsResult = await db.query(
      `SELECT * FROM postss WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    user.posts = postsResult.rows;

    // Get user's reviews with book titles
    const reviewsResult = await db.query(
      `SELECT review.*, books.title 
       FROM review 
       JOIN books ON review.book_id = books.id 
       WHERE review.user_id = $1`,
      [userId],
    );
    user.reviews = reviewsResult.rows;

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const targetUserId = parseInt(id);

    if (isNaN(targetUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const currentUser = await getUser();

    if (!currentUser || currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserIdDb = currentUser[0].id;

    // Only allow updating own profile
    if (currentUserIdDb !== targetUserId) {
      return NextResponse.json(
        { error: "Not authorized to update this profile" },
        { status: 403 },
      );
    }

    const { username, bio } = await request.json();

    const result = await db.query(
      `UPDATE user_account 
       SET username = COALESCE($1, username), 
           bio = COALESCE($2, bio)
       WHERE id = $3 
       RETURNING id, username, bio, clerk_id`,
      [username?.trim() || null, bio?.trim() || null, targetUserId],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const targetUserId = parseInt(id);

    if (isNaN(targetUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const currentUser = await getUser();

    if (!currentUser || currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserIdDb = currentUser[0].id;

    // Only allow deleting own profile
    if (currentUserIdDb !== targetUserId) {
      return NextResponse.json(
        { error: "Not authorized to delete this profile" },
        { status: 403 },
      );
    }

    // Delete related data
    await db.query(`DELETE FROM post_likes WHERE user_id = $1`, [targetUserId]);
    await db.query(`DELETE FROM postss WHERE user_id = $1`, [targetUserId]);
    await db.query(`DELETE FROM review WHERE user_id = $1`, [targetUserId]);
    await db.query(
      `DELETE FROM followers WHERE follower_id = $1 OR following_id = $1`,
      [targetUserId],
    );
    await db.query(`DELETE FROM user_account WHERE id = $1`, [targetUserId]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
