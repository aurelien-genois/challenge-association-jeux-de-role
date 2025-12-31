import { Router } from "express";
import games from "./games.route.js";
import auth from "./auth.route.js";
import users from "./users.route.js";

const router = Router();

router.use("/health", (_req, res) => {
  res.status(200).json({
    message: "All good here!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/games", games);

router.use("/", (_req, res) => {
  res.status(200).json({
    message: "Bienvenue dans l'API AJDR",
    timestamp: new Date().toISOString(),
  });
});

export default router;
