import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  date: Date;
   description?:string;
  user: mongoose.Types.ObjectId;
}

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
  type: String,
  required: true,
  index: true
},
    date: { type: Date, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required:true },
  },
  { timestamps: true }
);


expenseSchema.index({ user: 1 });
expenseSchema.index({ user: 1, date: -1 });

export default mongoose.model<IExpense>("Expense", expenseSchema);