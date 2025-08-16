import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IRanking extends Document {
    rank: number;
    playerId: string;
    playerName: string;
    stat: number;
}

export interface ILeaderboard extends Document {
    _id: mongoose.Types.ObjectId;
    type: string;
    ranking: IRanking[];
}

const RankingSchema: Schema = new Schema({
    rank: { type: Number, required: true },
    playerId: { type: String, required: true },
    playerName: { type: String, required: true },
    stat: { type: Number, required: true },
});

const LeaderboardSchema: Schema = new Schema({
    type: { type: String, required: true, unique: true }, // e.g., 'global-win-percentage'
    ranking: [RankingSchema],
});

const Leaderboard: Model<ILeaderboard> = models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);

export default Leaderboard;