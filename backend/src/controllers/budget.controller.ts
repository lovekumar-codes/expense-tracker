import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Budget from "../models/budget.model";
import Expense from "../models/expense.model";
import { budgetSchema } from "../validators/budget.validator";

// ➕ SET / UPDATE Monthly Budget
export const setBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
  return res.status(401).json({ message: "Unauthorized" });
}

if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
  return res.status(400).json({ message: "Invalid user id" });
}

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { amount } = budgetSchema.parse(req.body);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { user: userId, month, year },
      { amount },
      { new: true, upsert: true } // 🔥 create if not exists
    );

    res.json({
      message: "Budget set successfully",
      data: budget
    });

  } catch (error) {
    next(error);
  }
};

// 📊 GET Budget Status (spent + remaining + warning)
export const getBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
   if (!req.user?.id) {
  return res.status(401).json({ message: "Unauthorized" });
}

if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
  return res.status(400).json({ message: "Invalid user id" });
}
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    // 📅 month range
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    // 🔍 current budget
    const budget = await Budget.findOne({
      user: userId,
      month: month + 1,
      year
    });

    // 💸 spent this month
    const spentAgg = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const spent = spentAgg[0]?.total || 0;
    const totalBudget = budget?.amount || 0;
    const remaining = totalBudget - spent;

    // 🚨 warning logic
    let warning = "safe";
    if (totalBudget > 0 && spent >= totalBudget) {
      warning = "exceeded";
    } else if (totalBudget > 0 && spent >= totalBudget * 0.8) {
      warning = "near_limit";
    }

    res.json({
      budget: totalBudget,
      spent,
      remaining,
      warning
    });

  } catch (error) {
    next(error);
  }
};