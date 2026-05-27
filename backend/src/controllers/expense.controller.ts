import { Request, Response, NextFunction } from "express";
import { expenseSchema } from "../validators/expense.validator";
import Expense from "../models/expense.model";
import logger from "../utils/logger";
import mongoose from "mongoose";

// ➕ ADD EXPENSE
export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ step 1: auth check
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ step 2: id valid check
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // ✅ step 3: ek variable banao (IMPORTANT)
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ✅ step 4: validation
    const validated = expenseSchema.parse(req.body);

    // ✅ step 5: yaha use karo
    const expense = await Expense.create({
      ...validated,
      user: userId   // 👈 yaha change hai
    });

    res.status(201).json({
  message: "Expense added",
  data: expense
});

  } catch (error) {
  logger.error(error);
  next(error); 
}
};

// 📄 GET EXPENSES
export const getExpenses = async (req:Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const category = req.query.category as string;
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const sort = req.query.sort as string;

    let filter: any = { user: userId };

    // ✅ category
    if (category) {
      filter.category = category;
    }

    // ✅ search (FIXED)
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: new RegExp(safeSearch, "i") };
    }

    // ✅ date filter (FINAL)
    let dateFilter: any = {};

    if (startDate) {
      const sd = new Date(startDate);
      if (!isNaN(sd.getTime())) {
        dateFilter.$gte = sd;
      }
    }

    if (endDate) {
      const ed = new Date(endDate);
      if (!isNaN(ed.getTime())) {
        dateFilter.$lte = ed;
      }
    }

    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter;
    }

    // ✅ sorting (FINAL SAFE)
    let sortOption: any = { createdAt: -1 };

    const allowedSort = ["amount_asc", "amount_desc", "date_asc", "date_desc"];

    if (sort && allowedSort.includes(sort)) {
      if (sort === "amount_asc") sortOption = { amount: 1 };
      if (sort === "amount_desc") sortOption = { amount: -1 };
      if (sort === "date_asc") sortOption = { date: 1 };
      if (sort === "date_desc") sortOption = { date: -1 };
    }

    const expenses = await Expense.find(filter)
      .select("-__v")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOption)
      .lean();

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: expenses,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    next(error);
  }
};
export const updateExpense = async (req:Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const id = req.params.id as string;

if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid expense id" });
}

    const validated = expenseSchema.partial().parse(req.body);

    const updated = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      validated,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated",
      data: updated
    });

  } catch (error) {
    next(error);
  }
};
export const deleteExpense = async (req:Request, res: Response, next: NextFunction) => {
  try {
    // 🔐 auth
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🛡️ user id check
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

   const id = req.params.id as string;

if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid expense id" });
}

    // ❌ delete only if owner
    const deleted = await Expense.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    next(error);
  }
};
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🔐 auth
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🛡️ id check
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 🔥 totals
    const [today, month, year] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // 🔥 recent expenses (IMPORTANT)
   const recent = await Expense.find({ user: userId })
  .select("title amount category date")
  .sort({ createdAt: -1 })
  .limit(5)
  .lean();

    // 🔥 final response
    res.json({
      today: today[0]?.total || 0,
      month: month[0]?.total || 0,
      year: year[0]?.total || 0,
      recent
    });

  } catch (error) {
    logger.error(error);
    next(error);
  }
};
export const getChartData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
  return res.status(400).json({ message: "Invalid user id" });
}

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 🔥 Monthly expenses (Bar Chart)
    const monthly = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 🔥 Category wise (Pie Chart)
    const category = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      monthly,
      category
    });

  } catch (error) {
    next(error);
  }
};
export const getCategorySummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
  return res.status(400).json({ message: "Invalid user id" });
}

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const summary = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(summary);

  } catch (error) {
    next(error);
  }
};