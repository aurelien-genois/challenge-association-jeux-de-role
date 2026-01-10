import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse, ErrorDetail } from "../types/errorResponse.js";
import z, { ZodError } from "zod";
import { HttpClientError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === "production";

  const buildErrorResponse = function (
    status: number,
    type: string,
    message: string,
    details?: ErrorDetail[]
  ): ErrorResponse {
    return {
      status,
      error: { type, message, details },
      stack: isProduction
        ? undefined
        : error instanceof Error
        ? error.stack
        : undefined,
    };
  };

  if (error instanceof ZodError) {
    logger.error(`An 400 error occurred: ${error.message}`);
    return res.status(400).json(
      buildErrorResponse(
        400,
        "ZodError",
        `Invalid input: ${z.prettifyError(error)}`,
        error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        }))
      )
    );
  }

  if (error instanceof HttpClientError) {
    logger.error(`An ${error.status} error occurred: ${error.message}`);
    return res
      .status(error.status)
      .json(buildErrorResponse(error.status, error.name, error.message));
  }

  logger.error(`An unexpected error occurred`);
  return res
    .status(500)
    .json(
      buildErrorResponse(
        500,
        "InternalServerError",
        "An unexpected error occurred"
      )
    );
}
