import { db } from "@/utils/db";
import { getUser } from "@/utils/getUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/posts/[id] - Get a single post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const user = await getUser();
    const currentUserId = user ? user[0].id : null;

    // Get post with user info
    const posts = await db.query(
      `SELECT postss.*, user_account.username, user_account.clerk_id 
       FROM postss 
       JOIN user_account ON postss.user_id = user_account.id 
       WHERE postss.id = $1`,
      [postId],
    );

    if (posts.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = posts.rows[0];

    // Get like count
    const likeCountResult = await db.query(
      `SELECT COUNT(*) as count FROM post_likes WHERE post_id = $1`,
      [postId],
    );
    const likeCount = parseInt(likeCountResult.rows[0].count);

    // Check if current user has liked this post
    let isLiked = false;
    if (currentUserId) {
      const userLikeResult = await db.query(
        `SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2`,
        [currentUserId, postId],
      );
      isLiked = userLikeResult.rows.length > 0;
    }

    return NextResponse.json({
      ...post,
      likeCount,
      isLiked,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if post exists and belongs to the user
    const existingPost = await db.query(`SELECT * FROM postss WHERE id = $1`, [
      postId,
    ]);

    if (existingPost.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to update this post" },
        { status: 403 },
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `UPDATE postss SET content = $1 WHERE id = $2 RETURNING *`,
      [content.trim(), postId],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const user = await getUser();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdDb = user[0].id;

    // Check if post exists and belongs to the user
    const existingPost = await db.query(`SELECT * FROM postss WHERE id = $1`, [
      postId,
    ]);

    if (existingPost.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.rows[0].user_id !== userIdDb) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 },
      );
    }

    // Delete post likes first
    await db.query(`DELETE FROM post_likes WHERE post_id = $1`, [postId]);

    // Delete the post
    await db.query(`DELETE FROM postss WHERE id = $1`, [postId]);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
