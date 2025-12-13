import "dotenv/config";
import express from "express";
import router from "./routes/index.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/", router);

export default app;
