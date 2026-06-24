import express from "express";
import cors from "cors";

import "dotenv/config";
import fs from "fs";
import path from "path";

import { clerkMiddleware } from "@clerk/express";

import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const publicDir = path.join(process.cwd(), "public");

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(clerkMiddleware());

app.use(express.static(publicDir));

app.get("/health", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.get("/{*any}", (req, res,next) => {
    res.sendFile(path.join(publicDir, "index.html"),(err) => next(err));
});

// app.get("/{*any}", (req, res,next) => {
//   if (fs.existsSync(publicDir)) {
//     res.sendFile(path.join(publicDir, "index.html"));
//   } else {
//     res.status(404).json({ message: "Not Found" });
//   }
// });
app.listen(PORT, () => {
  connectDB();

  console.log(`Server is running on port ${PORT}`);
});
