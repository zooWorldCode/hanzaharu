import mongoose, { Schema, type Document, type Types } from "mongoose";

export type GameType = "card" | "speed" | "word" | "character";

export interface IGameScore {
  userId: Types.ObjectId;
  gameType: GameType;
  score: number;
  rewardCoins: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IGameScoreDocument = IGameScore & Document;

const GameScoreSchema = new Schema<IGameScore>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gameType: {
      type: String,
      enum: ["card", "speed", "word", "character"],
      required: true,
      index: true,
    },
    score: { type: Number, required: true, min: 0 },
    rewardCoins: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

const GameScore =
  mongoose.models.GameScore ||
  mongoose.model<IGameScore>("GameScore", GameScoreSchema);

export default GameScore;
