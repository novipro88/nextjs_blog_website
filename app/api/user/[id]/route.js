// http://localhost:3000/api/user/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { deleteManyPhotos } from "@/actions/uploadActions";

export async function PATCH(req, res) {
  await connect();

  const id = res.params.id;
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
    const body = await req.json();
    const user = await User.findById(id);

    if (user?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only author can update his/her data" },
        { status: 403 }
      );
    }

    const updateUser = await User.findByIdAndUpdate(user?._id, body, {
      new: true,
    });

    return NextResponse.json(updateUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "PATCH error" }, { status: 500 });
  }
}

export async function GET(req, res) {
  await connect();

  const id = res.params.id;

  try {
    const user = await User.findById(id).select("-password -__v");

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, res) {
  await connect();

  const id = res.params.id;
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
    const user = await User.findById(id).select("-password -__v");

    if (user?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only author can delete his/her data" },
        { status: 403 }
      );
    }

    const blogImages = await Blog.find({ authorId: id.toString() })
      .select("image")
      .exec();

    const formattedBlogImages = blogImages.map((imageObj) => ({
      id: imageObj.image.id,
    }));

    const userImages = await User.findById({ _id: id.toString() })
      .select("avatar")
      .exec();

    const finalImageIds = [
      ...formattedBlogImages,
      {
        id: userImages?.avatar?.id,
      },
    ];

    await Promise.all([
      User.findOneAndRemove({ _id: decodedToken._id.toString() }),
      Blog.deleteMany({ authorId: decodedToken._id.toString() }),
      deleteManyPhotos(finalImageIds),
    ]);

    return NextResponse.json({ msg: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete error" }, { status: 500 });
  }
}
