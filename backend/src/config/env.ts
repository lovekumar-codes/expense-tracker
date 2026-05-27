import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
];

requiredEnv.forEach((key) => {

  if (!process.env[key]) {

    throw new Error(
      `Missing environment variable: ${key}`
    );
  }
});

export const env = {
  PORT:
    process.env.PORT || "5000",

  MONGO_URI:
    process.env.MONGO_URI || "",

  JWT_SECRET:
    process.env.JWT_SECRET || "",

  NODE_ENV:
    process.env.NODE_ENV ||
    "development",
};