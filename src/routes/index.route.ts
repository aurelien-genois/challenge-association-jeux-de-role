import { Router } from "express";
import type { Request, Response } from "express";

export const router = Router();

router.use("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "All good here!",
    timestamp: new Date().toISOString(),
  });
});
