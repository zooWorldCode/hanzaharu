import mongoose, { Schema, type Document } from "mongoose";

export type GameRewardType = "avatar" | "house" | "coin" | "badge";
export type GameRewardRarity = "common" | "rare" | "epic" | "legendary";

export interface IGameReward {
  name: string;
  type: GameRewardType;
  rarity: GameRewardRarity;
  image?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IGameRewardDocument = IGameReward & Document;

const GameRewardSchema = new Schema<IGameReward>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["avatar", "house", "coin", "badge"],
      required: true,
      index: true,
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      required: true,
      index: true,
    },
    image: { type: String },
    price: { type: Number, min: 0 },
  },
  { timestamps: true },
);

const GameReward =
  mongoose.models.GameReward ||
  mongoose.model<IGameReward>("GameReward", GameRewardSchema);

export default GameReward;
