import "dotenv/config";
import express from "express";
import router from "./routes/index.route";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";
import { loggerMiddleware } from "./middlewares/httpLogger.middleware";
import morgan from "morgan";
import { config } from "../server.config";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Help secure Express apps by setting default HTTP response headers.
app.use(helmet());
// ensure origin matches your frontend URLs and credentials: true is set if you rely on cookie
app.use(cors({ origin: config.server.allowedOrigins, credentials: true }));

app.use(cookieParser());

app.use(morgan("dev")); // Concise output colored by response status for development use. default output stream
app.use(loggerMiddleware);

app.use(express.json());

app.use("/", router);

app.use(globalErrorHandler);

export default app;
