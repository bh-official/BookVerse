import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/posts - Get all posts with user info and like counts
export async function GET(request) {
  try {
    const user = await getUser();
    const currentUserId = user ? user[0].id : null;

    // Get all posts with user info
    const posts = (
      await db.query(
        `SELECT postss.*, user_account.username, user_account.clerk_id 
         FROM postss 
         JOIN user_account ON postss.user_id = user_account.id 
         ORDER BY postss.created_at DESC`,
      )
    ).rows;

    // Get like counts for all posts
    const postIds = posts.map((p) => p.id);
    let likeCounts = {};
    let userLikes = {};

    if (postIds.length > 0) {
      const likeCountsResult = await db.query(
        `SELECT post_id, COUNT(*) as count FROM post_likes WHERE post_id = ANY($1) GROUP BY post_id`,
        [postIds],
      );
      likeCountsResult.rows.forEach((row) => {
        likeCounts[row.post_id] = parseInt(row.count);
      });

      // Check which posts the current user has liked
      if (currentUserId) {
        const userLikesResult = await db.query(
          `SELECT post_id FROM post_likes WHERE user_id = $1 AND post_id = ANY($2)`,
          [currentUserId, postIds],
        );
        userLikesResult.rows.forEach((row) => {
          userLikes[row.post_id] = true;
        });
      }
    }

    // Add like info to each post
    const postsWithLikes = posts.map((post) => ({
      ...post,
      likeCount: likeCounts[post.id] || 0,
      isLiked: !!userLikes[post.id],
    }));

    return NextResponse.json(postsWithLikes);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `INSERT INTO postss (user_id, content) VALUES ($1, $2) RETURNING *`,
      [userIdDb, content.trim()],
    );

    const post = result.rows[0];

    // Get user info
    const userResult = await db.query(
      `SELECT username, clerk_id FROM user_account WHERE id = $1`,
      [userIdDb],
    );

    return NextResponse.json({
      ...post,
      username: userResult.rows[0]?.username,
      clerk_id: userResult.rows[0]?.clerk_id,
      likeCount: 0,
      isLiked: false,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
