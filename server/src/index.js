console.log(">>> Running index.js");

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