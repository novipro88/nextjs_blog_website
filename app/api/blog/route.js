// http://localhost:3000/api/blog

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function POST(req) {
  await connect();

  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "unauthorized (wrong or expired token" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const newblog = await Blog.create(body);

    return NextResponse.json(newblog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "POST error (create blog)" });
  }
}

export async function GET(req) {
  await connect();

  try {
    const blogs = await Blog.find({})
      .populate({
        path: "authorId",
        select: "-password",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}
