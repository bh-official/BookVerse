import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/users - Get all users
export async function GET(request) {
  try {
    const users = await db.query(
      `SELECT id, username, bio, clerk_id FROM user_account`,
    );

    // Get follower counts for all users
    const userIds = users.rows.map((u) => u.id);
    let followerCounts = {};
    let followingCounts = {};

    if (userIds.length > 0) {
      const followerCountsResult = await db.query(
        `SELECT following_id, COUNT(*) as count FROM followers WHERE following_id = ANY($1) GROUP BY following_id`,
        [userIds],
      );
      followerCountsResult.rows.forEach((row) => {
        followerCounts[row.following_id] = parseInt(row.count);
      });

      const followingCountsResult = await db.query(
        `SELECT follower_id, COUNT(*) as count FROM followers WHERE follower_id = ANY($1) GROUP BY follower_id`,
        [userIds],
      );
      followingCountsResult.rows.forEach((row) => {
        followingCounts[row.follower_id] = parseInt(row.count);
      });
    }

    // Add follower counts to users
    const usersWithCounts = users.rows.map((user) => ({
      ...user,
      followerCount: followerCounts[user.id] || 0,
      followingCount: followingCounts[user.id] || 0,
    }));

    return NextResponse.json(usersWithCounts);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// POST /api/users - Create a new user (for onboarding)
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, bio } = await request.json();

    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Check if clerk_id already exists
    const existingUser = await db.query(
      `SELECT * FROM user_account WHERE clerk_id = $1`,
      [userId],
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const result = await db.query(
      `INSERT INTO user_account (username, bio, clerk_id) VALUES ($1, $2, $3) RETURNING *`,
      [username.trim(), bio?.trim() || null, userId],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
