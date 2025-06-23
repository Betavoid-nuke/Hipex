import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose'; // adjust to your actual DB connect file
import Countdowns from '../../../lib/models/Countdowns.model'; // adjust model path
import { currentUser } from '@clerk/nextjs/server';

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { CDID } = await req.json();
    if (!CDID) {
      return NextResponse.json({ error: 'Missing CDID' }, { status: 400 });
    }

    const existing = await Countdowns.findById(CDID);
    if (!existing) {
      return NextResponse.json({ error: 'Countdown not found' }, { status: 404 });
    }

    // Ensure the user owns the document
    if (existing.userid.toString() !== user.id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this project' }, { status: 403 });
    }

    await Countdowns.findByIdAndDelete(CDID);

    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
