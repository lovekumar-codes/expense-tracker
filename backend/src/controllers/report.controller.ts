import {
Request,
Response,
NextFunction,
} from "express";

import mongoose from "mongoose";
import { exportToCSV } from "../utils/export";
import { exportToJSON } from "../utils/export";

import Expense from "../models/expense.model";

// 📅 Monthly Report
export const getMonthlyReport =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

if (!req.user?.id) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const userId =
  new mongoose.Types.ObjectId(
    req.user.id
  );

const monthly =
  await Expense.aggregate([
    {
      $match: {
        user: userId,
      },
    },

    {
      $group: {
        _id: {
          month: {
            $month: "$date",
          },
        },

        total: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

res.json(monthly);

} catch (error) {
next(error);
}
};

// 📆 Yearly Report
export const getYearlyReport =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

if (!req.user?.id) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const userId =
  new mongoose.Types.ObjectId(
    req.user.id
  );

const yearly =
  await Expense.aggregate([
    {
      $match: {
        user: userId,
      },
    },

    {
      $group: {
        _id: {
          year: {
            $year: "$date",
          },
        },

        total: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        "_id.year": 1,
      },
    },
  ]);

res.json(yearly);

} catch (error) {
next(error);
}
};

// 🏆 TOP SPENDING CATEGORIES
export const getTopSpendingCategories =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

if (!req.user?.id) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

const userId =
  new mongoose.Types.ObjectId(
    req.user.id
  );

const top =
  await Expense.aggregate([
    {
      $match: {
        user: userId,
      },
    },

    {
      $group: {
        _id: "$category",

        total: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        total: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

res.json(top);

} catch (error) {
next(error);
}
};
// 📈 EXPENSE TREND REPORT

export const getExpenseTrend =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

if (!req.user?.id) {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

if (
  !mongoose.Types.ObjectId.isValid(
    req.user.id
  )
) {
  return res.status(400).json({
    message: "Invalid user id",
  });
}

const userId =
  new mongoose.Types.ObjectId(
    req.user.id
  );

// last 30 days

const last30Days =
  new Date();

last30Days.setDate(
  last30Days.getDate() - 30
);

const trend =
  await Expense.aggregate([
    {
      $match: {
        user: userId,

        date: {
          $gte: last30Days,
        },
      },
    },

    {
      $group: {
        _id: {
          dayOfMonth: {
            $dayOfMonth: "$date",
          },

          month: {
            $month: "$date",
          },
        },

        total: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        "_id.month": 1,
        "_id.dayOfMonth": 1,
      },
    },
  ]);

res.json(trend);

} catch (error) {
next(error);
}
};
export const exportExpenses =
async (req: any, res: any, next: any) => {
try {

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const format = req.query.format || "json";

  const expenses = await Expense.find({ user: userId })
    .select("title amount category date description")
    .lean();

  if (format === "csv") {
    return exportToCSV(res, expenses, "expenses");
  }

  return exportToJSON(res, expenses, "expenses");

} catch (err) {
  next(err);
}
};