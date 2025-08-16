import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Frame from '@/lib/models/frame';
import User from '@/lib/models/user';

// POST: Create a new frame
export async function POST(request: Request) {
    const { userId } = await auth(); // ✅ Await the promise
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { location, tag, players, creatorId } = body;

        // Security check: ensure the creator is the logged-in user
        if (creatorId !== userId) {
            return NextResponse.json({ error: 'Mismatched creator ID' }, { status: 403 });
        }

        await dbConnect();

        const newFrame = await Frame.create({
            date: new Date(),
            location,
            tag,
            players, // [{ clerkId, name, score }]
            creatorId,
            status: 'pending',
            turnIndex: 0,
            log: [],
        });

        return NextResponse.json(newFrame, { status: 201 });
    } catch (error) {
        console.error("Failed to create frame:", error);
        return NextResponse.json({ error: 'Failed to create frame' }, { status: 500 });
    }
}

// PUT: Update an existing frame
export async function PUT(request: Request) {
    const { userId } = await auth(); // ✅ Await the promise
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { frameId, updates } = await request.json();

        await dbConnect();

        const frame = await Frame.findById(frameId);
        if (!frame) {
            return NextResponse.json({ error: 'Frame not found' }, { status: 404 });
        }

        // Security check: only the creator can update the frame
        if (frame.creatorId !== userId) {
            return NextResponse.json({ error: 'Only the frame creator can make updates' }, { status: 403 });
        }

        const updatedFrame = await Frame.findByIdAndUpdate(frameId, updates, { new: true });

        return NextResponse.json(updatedFrame, { status: 200 });
    } catch (error) {
        console.error("Failed to update frame:", error);
        return NextResponse.json({ error: 'Failed to update frame' }, { status: 500 });
    }
}
