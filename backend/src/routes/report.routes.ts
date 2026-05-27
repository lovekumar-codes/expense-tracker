import { Router } from "express";

import {
  getMonthlyReport,
  getYearlyReport,
  getTopSpendingCategories,
  getExpenseTrend,
  exportExpenses
} from "../controllers/report.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

// 📅 MONTHLY REPORT
router.get(
  "/monthly",
  protect,
  getMonthlyReport
);

// 📆 YEARLY REPORT
router.get(
  "/yearly",
  protect,
  getYearlyReport
);

// 🏆 TOP CATEGORIES
router.get(
  "/top-categories",
  protect,
  getTopSpendingCategories
);

// 📈 TREND REPORT
router.get(
  "/trend",
  protect,
  getExpenseTrend
);

// 📤 EXPORT REPORT
router.get(
  "/export",
  protect,
  exportExpenses
);

export default router;