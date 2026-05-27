import {
Request,
Response,
NextFunction,
} from "express";

import mongoose from "mongoose";

import Category from "../models/category.model";

// ➕ ADD CATEGORY

export const addCategory =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

  if (!req.user?.id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      req.user.id
    )
  ) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const userId =
    new mongoose.Types.ObjectId(
      req.user.id
    );

  const { name, color } =
    req.body;

  // ✅ already exists check

  const exists =
    await Category.findOne({
      name,
      user: userId,
    });

  if (exists) {
    return res.status(409).json({
      message:
        "Category already exists",
    });
  }

  const category =
    await Category.create({
      name,
      color,
      user: userId,
      isDefault: false,
    });

  res.status(201).json({
    message:
      "Category created successfully",

    data: category,
  });

} catch (error) {
  next(error);
}

};

// 📄 GET CATEGORIES

export const getCategories =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

  if (!req.user?.id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      req.user.id
    )
  ) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const userId =
    new mongoose.Types.ObjectId(
      req.user.id
    );

  // ✅ default + custom categories

  const categories =
    await Category.find({
      $or: [
        { isDefault: true },
        { user: userId },
      ],
    }).sort({
      createdAt: -1,
    });

  res.json(categories);

} catch (error) {
  next(error);
}

};

// ❌ DELETE CATEGORY

export const deleteCategory =
async (
req: Request,
res: Response,
next: NextFunction
) => {
try {

  if (!req.user?.id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      req.user.id
    )
  ) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const userId =
    new mongoose.Types.ObjectId(
      req.user.id
    );

  const id =
    req.params.id;

  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid category id",
    });
  }

  const deleted =
    await Category.findOneAndDelete({
      _id: id,
      user: userId,
      isDefault: false,
    });

  if (!deleted) {
    return res.status(404).json({
      message:
        "Category not found",
    });
  }

  res.json({
    message:
      "Category deleted successfully",
  });

} catch (error) {
  next(error);
}

};