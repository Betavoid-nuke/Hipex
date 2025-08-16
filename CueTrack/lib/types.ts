// This file is the single source of truth for your data shapes.

export interface IUser {
    _id: string;
    clerkId: string;
    name: string;
    avatar: string;
    friends: string[];
    stats?: {
        totalFrames: number;
        winPercentage: number;
        highestBreak: number;
    };
}

export interface IFrame {
    _id: string;
    date: string;
    location: string;
    tag: string;
    creatorId: string; // This should be a clerkId
    status: 'pending' | 'live' | 'completed';
    startTime: string | null;
    endTime: string | null;
    players: { clerkId: string; name: string; score: number; }[];
    winnerId: string | null; // This will be a clerkId
    turnIndex: number;
    log: { turn: number; playerId: string; points: number; }[]; // playerId is a clerkId
}

export interface IVenue {
    _id: string;
    name: string;
    rating: number;
    lat: number;
    lon: number;
}