import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";

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

    // Add friendId to friendsId[] (no duplicates)
    await User.updateOne(
      { _id: userId },
      { $addToSet: { friendsId: friendId } }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friendsId: friendId } }, // or $pull for remove
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
    console.error("❌ Error adding friend:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
