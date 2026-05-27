import { z } from "zod";

export const budgetSchema = z.object({
  amount: z.number().positive("Budget must be positive")
});