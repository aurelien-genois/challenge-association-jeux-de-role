import rateLimit from "express-rate-limit";
import { RateLimitError } from "../utils/errors.js";

export const createLimiter = (max: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max,
    handler: (_req, res, next) => {
      next(new RateLimitError());
    },
  });

export const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000,
  handler: (_req, _res, next) => {
    next(new RateLimitError("Too many requests globally"));
  },
  skip: (req) => {
    // Skip global limiter for sensitive routes that have their own limiter
    const path = req.path;
    return path.startsWith("/auth/login") || path.startsWith("/auth/register");
  },
});
