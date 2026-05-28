import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IAttendance {
  userId: Types.ObjectId;
  date: Date;
  rewardCoins: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IAttendanceDocument = IAttendance & Document;

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    rewardCoins: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
