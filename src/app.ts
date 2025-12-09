import "dotenv/config";
import express from "express";
import { router } from "./routes/index.route";

export const app = express();

app.use("/", router);
