import { Router } from "express";
import { setBudget, getBudget } from "../controllers/budget.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, setBudget);   // set/update
router.get("/", protect, getBudget);    // status

export default router;