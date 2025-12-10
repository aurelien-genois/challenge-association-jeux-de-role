import { Router } from "express";
import games from "./games.route";

const router = Router();

router.use("/health", (_req, res) => {
  res.status(200).json({
    message: "All good here!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/games", games);

export default router;
