import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/index.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.send("API is running ");
});

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/blog", blogRouter);

// Global error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      data: null,
      errors: err.errors || [],
    });
  }

  res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    errors: [],
  });
});


let isDbConnected = false;

async function ensureDb() {
  if (!isDbConnected) {
    await connectDb();
    console.log("MONGODB connected");
    isDbConnected = true;
  }
}

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
