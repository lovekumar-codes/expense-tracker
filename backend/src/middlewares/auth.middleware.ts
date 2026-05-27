import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import logger from "../utils/logger";

interface JwtPayload {
  id: string;
  email: string;
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    // ✅ token extract
    const token =
      authHeader &&
      authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided",
      });
    }

    // ✅ env check
    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET missing"
      );
    }

    // ✅ verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    // ✅ attach user
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (err: any) {

    logger.error(
      `Auth middleware error: ${err.message}`
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};