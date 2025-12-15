import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  defaultMeta: { service: "ajdr-api" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new DailyRotateFile({
      level: "error",
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      level: "http",
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
