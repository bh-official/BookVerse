import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/users/[id]/follow - Follow a user
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const followingId = parseInt(id);

    if (isNaN(followingId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = user[0].id;

    // Cannot follow yourself
    if (currentUserId === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 },
      );
    }

    // Check if user to follow exists
    const targetUser = await db.query(
      `SELECT * FROM user_account WHERE id = $1`,
      [followingId],
    );

    if (targetUser.rows.length === 0) {
      return NextResponse.json(
        { error: "User to follow not found" },
        { status: 404 },
      );
    }

    // Check if already following
    const existingFollow = await db.query(
      `SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2`,
      [currentUserId, followingId],
    );

    if (existingFollow.rows.length > 0) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 409 },
      );
    }

    await db.query(
      `INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)`,
      [currentUserId, followingId],
    );

    return NextResponse.json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 },
    );
  }
}

// DELETE /api/users/[id]/follow - Unfollow a user
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const followingId = parseInt(id);

    if (isNaN(followingId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = user[0].id;

    await db.query(
      `DELETE FROM followers WHERE follower_id = $1 AND following_id = $2`,
      [currentUserId, followingId],
    );

    return NextResponse.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 },
    );
  }
}
