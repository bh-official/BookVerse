import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: postId } = await params;
  const user = await getUser();

  if (!user || user.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userIdDb = user[0].id;

  // Check if already liked
  const existingLike = await db.query(
    `SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2`,
    [userIdDb, postId],
  );

  let liked;
  if (existingLike.rows.length > 0) {
    // Unlike - remove the like
    await db.query(
      `DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2`,
      [userIdDb, postId],
    );
    liked = false;
  } else {
    // Like - add the like
    await db.query(
      `INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userIdDb, postId],
    );
    liked = true;
  }

  // Get updated like count
  const likeCountResult = await db.query(
    `SELECT COUNT(*) as count FROM post_likes WHERE post_id = $1`,
    [postId],
  );
  const likeCount = parseInt(likeCountResult.rows[0].count);

  return NextResponse.json({ liked, likeCount });
}
