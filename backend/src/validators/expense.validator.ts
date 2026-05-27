import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().min(2),
  amount: z.number()
  .positive()
  .max(10000000),
  category: z.string(),
  date: z.coerce.date(),
  description: z.string().optional()
});