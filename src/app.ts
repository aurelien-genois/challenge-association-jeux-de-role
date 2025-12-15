import "dotenv/config";
import express from "express";
import router from "./routes/index.route";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";
import { loggerMiddleware } from "./middlewares/httpLogger.middleware";
import morgan from "morgan";

const app = express();

app.use(cookieParser());

app.use(morgan("dev")); // Concise output colored by response status for development use. default output stream
app.use(loggerMiddleware);

app.use(express.json());

app.use("/", router);

app.use(globalErrorHandler);

export default app;
