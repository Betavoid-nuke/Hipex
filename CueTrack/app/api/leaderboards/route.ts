import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';
import Frame from '@/lib/models/frame';
// Note: In a real app, you might use the Leaderboard model to store pre-calculated results.
// For simplicity, we calculate this on the fly here.

// GET the global leaderboard
export async function GET(request: Request) {
  await dbConnect();

  try {
    const allUsers = await User.find({}).lean();
    const allCompletedFrames = await Frame.find({ status: 'completed' }).lean();

    const playerStats = allUsers.map(user => {
      const userFrames = allCompletedFrames.filter(frame => 
        frame.players.some(p => p.id === user.id)
      );

      const totalFrames = userFrames.length;
      const wins = userFrames.filter(frame => frame.winnerId === user.id).length;
      const winPercentage = totalFrames > 0 ? Math.round((wins / totalFrames) * 100) : 0;
      
      const highestBreak = userFrames.reduce((maxBreak, frame) => {
        const userTurns = frame.log.filter(l => l.playerId === user.id && l.points > 0);
        const maxTurnPoints = userTurns.length > 0 ? Math.max(...userTurns.map(t => t.points)) : 0;
        return Math.max(maxBreak, maxTurnPoints);
    }, 0);

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        stats: {
          totalFrames,
          winPercentage,
          highestBreak,
        }
      };
    });

    // Sort users by win percentage (descending) and take the top 10
    const rankedUsers = playerStats
      .sort((a, b) => b.stats.winPercentage - a.stats.winPercentage)
      .slice(0, 10);

    return NextResponse.json(rankedUsers);
  } catch (error) {
    console.error("Failed to generate leaderboard:", error);
    return NextResponse.json({ error: 'Failed to generate leaderboard' }, { status: 500 });
  }
}