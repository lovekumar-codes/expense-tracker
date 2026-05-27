import { Router } from "express";

import {
addCategory,
getCategories,
deleteCategory,
} from "../controllers/category.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

// ➕ Add category
router.post(
"/",
protect,
addCategory
);

// 📄 Get categories
router.get(
"/",
protect,
getCategories
);

// ❌ Delete category
router.delete(
"/:id",
protect,
deleteCategory
);

export default router;