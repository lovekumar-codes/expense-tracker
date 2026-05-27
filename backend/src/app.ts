import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import expenseRoutes from "./routes/expense.routes";
import authRoutes from "./routes/auth.routes";
import budgetRoutes from "./routes/budget.routes";
import errorMiddleware from "./middlewares/error.middleware";
import categoryRouter from "./routes/category.routes"
import reportRoutes from "./routes/report.routes"
import swaggerSpec from "./config/swagger";
import SwaggerUi from "swagger-ui-express";

const app = express();


// ✅ RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later",
});


// ✅ CORS FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// ✅ BODY PARSER
app.use(express.json());


// ✅ HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);


// ✅ RATE LIMIT ONLY API
app.use("/api", limiter);


// ✅ LOGGER
app.use(morgan("dev"));
app.use("/api/doc",SwaggerUi.serve,SwaggerUi.setup(swaggerSpec))


// ✅ ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/budget", budgetRoutes);
app.use("/api/reports",reportRoutes);

app.use(
"/api/categories",
categoryRouter
);

// ✅ 404 HANDLER
app.use((req, res, next) => {
  const error: any = new Error("Route not found");

  error.status = 404;

  next(error);
});


// ✅ GLOBAL ERROR HANDLER
app.use(errorMiddleware);

export default app;