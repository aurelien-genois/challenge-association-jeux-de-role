import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpClientError } from "../utils/errors";

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseError = {
    stack: isProduction
      ? undefined
      : error instanceof Error
      ? error.stack
      : undefined,
  };

  if (error instanceof z.ZodError) {
    res.status(400).json({
      ...baseError,
      status: 400,
      error: {
        type: "ZodError",
        message: "Invalid input",
        details: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof HttpClientError) {
    res.status(error.status).json({
      ...baseError,
      status: error.status,
      error: {
        type: error.name,
        message: error.message,
      },
    });
    return;
  }

  res.status(500).json({
    ...baseError,
    status: 500,
    error: {
      type: "InternalServerError",
      message: "An unexpected error occurred",
    },
  });

  return;
}
