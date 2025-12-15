import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse, ErrorDetail } from "../types/errorResponse";
import z from "zod";
import { HttpClientError } from "../utils/errors";
import { logger } from "../utils/logger";

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === "production";

  const buildErrorResponse = (
    status: number,
    type: string,
    message: string,
    details?: ErrorDetail[]
  ): ErrorResponse => ({
    status,
    error: { type, message, details },
    stack: isProduction
      ? undefined
      : error instanceof Error
      ? error.stack
      : undefined,
  });

  // Winston logger
  if (
    error instanceof Error ||
    error instanceof z.ZodError ||
    error instanceof HttpClientError
  ) {
    logger.error(`An error occurred: ${error.message}`);
  }

  if (error instanceof z.ZodError) {
    res.status(400).json(
      buildErrorResponse(
        400,
        "ZodError",
        "Invalid input",
        error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        }))
      )
    );
    return;
  }

  if (error instanceof HttpClientError) {
    res
      .status(error.status)
      .json(buildErrorResponse(error.status, error.name, error.message));
    return;
  }

  res
    .status(500)
    .json(
      buildErrorResponse(
        500,
        "InternalServerError",
        "An unexpected error occurred"
      )
    );

  return;
}
