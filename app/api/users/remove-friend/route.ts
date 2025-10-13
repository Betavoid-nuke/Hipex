import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { AppUser } from "@/twinx/types/TwinxTypes";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { userId, friendId } = await req.json();

    if (!userId || !friendId)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // Ensure both users exist
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);

    if (!user || !friend)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Remove friendId from friendsId[]
    await User.updateOne(
      { _id: userId },
      { $pull: { friendsId: friendId } }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friendsId: friendId } },
      { new: true } // ensures we get the updated doc
    ).lean(); // converts to plain object

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      friendsId: (updatedUser as any).friendsId || [],
    });

  } catch (error) {
    console.error("❌ Error removing friend:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
