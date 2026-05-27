import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

import mongoose from "mongoose";

import ApiError from "../utils/ApiError";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(err);

  // ✅ Custom ApiError

  if (err instanceof ApiError) {

    return res.status(
      err.statusCode
    ).json({
      success: false,
      message: err.message,
    });
  }

  // ✅ Zod Validation Error

  if (err instanceof ZodError) {

    return res.status(400).json({
      success: false,

      message: "Validation failed",

      errors: err.issues.map(
        (e) => ({
          field: e.path.join("."),
          message: e.message,
        })
      ),
    });
  }

  // ✅ Mongo Invalid ObjectId

  if (
    err instanceof
    mongoose.Error.CastError
  ) {

    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  // ✅ Mongo Duplicate Key

  if (err.code === 11000) {

    return res.status(409).json({
      success: false,

      message:
        "Duplicate field value",
    });
  }

  // ✅ JWT errors

  if (
    err.name ===
    "JsonWebTokenError"
  ) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {

    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // ✅ Default Server Error

  return res.status(500).json({
    success: false,

    message:
      process.env.NODE_ENV ===
      "production"
        ? "Internal server error"
        : err.message,

    stack:
      process.env.NODE_ENV ===
      "production"
        ? undefined
        : err.stack,
  });
};

export default errorMiddleware;