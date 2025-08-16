import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';
import Frame from '@/lib/models/frame';

// GET all users OR a single user with stats
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  await dbConnect();

  // If a specific user ID is provided, fetch that user and calculate their stats
  if (userId) {
    const user = await User.findOne({ id: userId }).lean(); // .lean() for a plain JS object
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // --- Calculate User Stats on the fly ---
    const completedFrames = await Frame.find({ 
      'players.id': userId, 
      status: 'completed' 
    }).lean();

    const totalFramesPlayed = completedFrames.length;
    const wins = completedFrames.filter(f => f.winnerId === userId).length;
    const winPercentage = totalFramesPlayed > 0 ? Math.round((wins / totalFramesPlayed) * 100) : 0;
    
    const highestBreak = completedFrames.reduce((maxBreak, frame) => {
        const userTurns = frame.log.filter(l => l.playerId === userId && l.points > 0);
        const maxTurnPoints = userTurns.length > 0 ? Math.max(...userTurns.map(t => t.points)) : 0;
        return Math.max(maxBreak, maxTurnPoints);
    }, 0);
    
    const userWithStats = {
        ...user,
        stats: {
            totalFrames: totalFramesPlayed,
            winPercentage: winPercentage,
            highestBreak: highestBreak,
        }
    };
    
    return NextResponse.json(userWithStats);
  }

  // If no user ID, return all users (useful for the Find Friends page)
  const users = await User.find({});
  return NextResponse.json(users);
}

// POST a new user (for initial setup or registration)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await dbConnect();
        const newUser = await User.create(body);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}