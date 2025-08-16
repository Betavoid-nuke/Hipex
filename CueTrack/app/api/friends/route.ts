import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';

// POST: Add a new friend
export async function POST(request: Request) {
    // ✅ Await the promise returned by auth()
    const { userId } = await auth(); 

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { friendId } = await request.json();

        if (!friendId || userId === friendId) {
            return NextResponse.json({ error: 'Invalid friend ID' }, { status: 400 });
        }

        await dbConnect();

        // Add friendId to the current user's friend list (two-way friendship)
        await User.updateOne({ clerkId: userId }, { $addToSet: { friends: friendId } });
        await User.updateOne({ clerkId: friendId }, { $addToSet: { friends: userId } });

        return NextResponse.json({ message: 'Friend added successfully' }, { status: 200 });

    } catch (error) {
        console.error("Failed to add friend:", error);
        return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 });
    }
}
