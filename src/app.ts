import "dotenv/config";
import express from "express";
import router from "./routes/index.route";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandlers";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/", router);

app.use(globalErrorHandler);

export default app;
