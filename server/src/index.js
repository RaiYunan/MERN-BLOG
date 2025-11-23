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

// Updated CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-blog-mzrc.vercel.app",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed or is a Vercel preview deployment
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
  res.send("API is running");
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

// Database connection for serverless
let isDbConnected = false;

async function ensureDb() {
  if (!isDbConnected) {
    try {
      await connectDb();
      console.log("MONGODB connected");
      isDbConnected = true;
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw error;
    }
  }
}

// Serverless function handler
export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}