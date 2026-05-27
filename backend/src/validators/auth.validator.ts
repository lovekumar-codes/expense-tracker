import { z } from "zod";

// 🔐 Password rules (reuseable)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password too long")
  .regex(/[A-Z]/, "At least one uppercase letter required")
  .regex(/[a-z]/, "At least one lowercase letter required")
  .regex(/[0-9]/, "At least one number required")
  .regex(/[@$!%*?&]/, "At least one special character required");

// 📩 Register Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .trim(),

  email: z
    .string()
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  password: passwordSchema,
});

// 🔑 Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password is required"),
});