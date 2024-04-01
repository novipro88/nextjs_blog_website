// http://localhost:3000/api/blog/blogid/comment/commentId

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function DELETE(req, res) {
  await connect();

  const id = res.params.id;
  const commentId = res.params.commentId;
  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return NextResponse.json(
      { error: "unauthorized (wrong or expired token)" },
      { status: 403 }
    );
  }

  try {
    const blog = await Blog.findById(id)
      .populate("authorId")
      .populate("comments.user");

    const comment = blog.comments.find((comment) => comment.id === commentId);

    if (!comment) {
      return NextResponse.json(
        { mes: "Comment does not exist" },
        { status: 404 }
      );
    }

    if (comment?.user?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only author can delete his/her comment" },
        { status: 403 }
      );
    }

    blog.comments = blog.comments.filter((comment) => comment.id !== commentId);

    await blog.save();

    return NextResponse.json(
      { msg: "Successfully deleted comment" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Delete error" }, { status: 500 });
  }
}
