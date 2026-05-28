import mongoose, { Schema, type Document, type Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  level: number;
  exp: number;
  coins: number;
  streak: number;
  avatarItems: Types.ObjectId[];
  houseItems: Types.ObjectId[];
  equippedAvatar?: Types.ObjectId;
  equippedHouse?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = IUser & Document;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    level: { type: Number, default: 1, min: 1 },
    exp: { type: Number, default: 0, min: 0 },
    coins: { type: Number, default: 0, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
    avatarItems: [
      { type: Schema.Types.ObjectId, ref: "GameReward" },
    ],
    houseItems: [{ type: Schema.Types.ObjectId, ref: "GameReward" }],
    equippedAvatar: { type: Schema.Types.ObjectId, ref: "GameReward" },
    equippedHouse: { type: Schema.Types.ObjectId, ref: "GameReward" },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
