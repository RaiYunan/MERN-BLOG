import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDb } from "./db/index.js";

dotenv.config({
    path:"./.env"
});

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Yunan Rai");
});



connectDb()
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})
.catch((err) => {
    console.log(" MONGODB Connection failed:", err);
    process.exit(1);
});

import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.route.js"
import { ApiError } from "./utils/ApiError.js";
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",userRouter)

// Global error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // If ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      data: null,
      errors: err.errors || []
    });
  }

  // For any other error
  res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    errors: []
  });
});
