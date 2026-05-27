import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  month: number; // 1–12
  year: number;
  amount: number;
}

const budgetSchema = new Schema<IBudget>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
 month: { type: Number, required: true, min: 1, max: 12 },
 year: { type: Number, required: true, min: 2020 },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// 🔥 same user + month + year → single record
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IBudget>("Budget", budgetSchema);