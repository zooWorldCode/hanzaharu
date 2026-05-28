import mongoose, { Schema, type Document, type Types } from "mongoose";

export type QuizType = "meaning" | "reading" | "matching" | "image";

export interface IQuiz {
  hanjaId: Types.ObjectId;
  type: QuizType;
  question: string;
  choices: string[];
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IQuizDocument = IQuiz & Document;

const QuizSchema = new Schema<IQuiz>(
  {
    hanjaId: {
      type: Schema.Types.ObjectId,
      ref: "Hanja",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["meaning", "reading", "matching", "image"],
      required: true,
      index: true,
    },
    question: { type: String, required: true, trim: true },
    choices: [{ type: String, required: true, trim: true }],
    answer: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Quiz =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
