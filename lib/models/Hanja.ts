import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHanja extends Document {
  character?: string;        // 한자 (hanja 카테고리만)
  word: string;              // 단어/사자성어/어휘
  meaning: string;           // 뜻
  reading?: string;          // 음 (hanja 카테고리만)
  examples?: string[];       // 예시 단어/문장
  explanation?: string;      // 설명
  story?: string;            // 스토리/유래
  category: 'hanja' | 'idiom' | 'vocabulary';
  difficulty: 'easy' | 'normal' | 'hard';
  tags?: string[];
  image?: string;
}

const HanjaSchema = new Schema<IHanja>(
  {
    character: { type: String },
    word:      { type: String, required: true },
    meaning:   { type: String, required: true },
    reading:   { type: String },
    examples:  [{ type: String }],
    explanation: { type: String },
    story:     { type: String },
    category:  {
      type: String,
      enum: ['hanja', 'idiom', 'vocabulary'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard'],
      default: 'easy',
    },
    tags:  [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

HanjaSchema.index(
  { word: 'text', meaning: 'text', reading: 'text', tags: 'text' }
);
HanjaSchema.index({ category: 1, difficulty: 1 });

const Hanja: Model<IHanja> =
  mongoose.models.Hanja ?? mongoose.model<IHanja>('Hanja', HanjaSchema);

export default Hanja;