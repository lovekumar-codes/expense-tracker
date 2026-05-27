import { Request, Response} from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { env } from "../config/env";
// REGISTER
export const register = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const result =
      registerSchema.safeParse(
        req.body
      );

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed"
      );
    }

    const data = result.data;

    const exists =
      await User.findOne({
        email: data.email,
      });

    if (exists) {
      throw new ApiError(
        409,
        "Email already exists"
      );
    }

    const hashed =
      await bcrypt.hash(
        data.password,
        10
      );

    await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          "User registered successfully"
        )
      );
  }
);

// LOGIN
export const login = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const result =
      loginSchema.safeParse(
        req.body
      );

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed"
      );
    }

    const data = result.data;

    const user =
      await User.findOne({
        email: data.email,
      });

    if (!user) {
      throw new ApiError(
        401,
        "Invalid credentials"
      );
    }

    const match =
      await bcrypt.compare(
        data.password,
        user.password
      );

    if (!match) {
      throw new ApiError(
        401,
        "Invalid credentials"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(
        500,
        "JWT secret missing"
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },

      env.JWT_SECRET,

      {
        expiresIn: "7d",
        issuer: "expensepro",
      }
    );

    return res.json(
      new ApiResponse(
        true,
        "Login successful",
        {
          token,

          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        }
      )
    );
  }
);