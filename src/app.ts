import "dotenv/config";
import express from "express";
import { router } from "./routes/index.route.js";

export const app = express();

app.use("/api", router);
