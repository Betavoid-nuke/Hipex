import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const existing = await User.findOne({ id: body.id });
    if (existing) {
      return NextResponse.json({ message: "User already exists", id: existing.id }, { status: 200 });
    }

    const newUser = await User.create({
      id: body.id,
      username: body.username,
      name: body.name,
      bio: body.bio,
      socialhandles: body.socialhandles,
      onboarded: true,
    });

    return NextResponse.json({ message: "User created", id: newUser.id }, { status: 201 });
  } catch (err) {
    console.error("❌ User creation failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
