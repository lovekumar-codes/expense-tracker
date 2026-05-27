import { Router } from "express";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getStats,
  getChartData,
  getCategorySummary
} from "../controllers/expense.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

// 🔐 Protected routes
router.get("/", protect, getExpenses);
router.post("/", protect, addExpense);
router.get("/stats", protect, getStats);
router.get("/chart", protect, getChartData);
router.get("/category-summary", protect, getCategorySummary); 
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;