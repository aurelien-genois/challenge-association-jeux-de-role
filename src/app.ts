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
import bodySanitizer from "./middlewares/bodySanitizer.middleware";

const app = express();

// Help secure Express apps by setting default HTTP response headers.
app.use(helmet());
// ensure origin matches your frontend URLs and credentials: true is set if you rely on cookie
app.use(cors({ origin: config.server.allowedOrigins, credentials: true }));

app.use(express.json()); // Parses incoming requests with Content-Type: application/json (converts raw JSON into req.body)

// Parses requests with Content-Type: application/x-www-form-urlencoded
// "extended" allows rich objects/arrays via the qs library
// Useful if: traditionnal form submissions and the API support clients that send data as URL‑encoded instead of JSON
// app.use(express.urlencoded({ extended: true }));

app.use(bodySanitizer); // Prevents XSS or injection attacks

app.use(cookieParser());

app.use(morgan("dev")); // Concise output colored by response status for development use. default output stream
app.use(loggerMiddleware);

app.use("/", router);

app.use(globalErrorHandler);

export default app;
